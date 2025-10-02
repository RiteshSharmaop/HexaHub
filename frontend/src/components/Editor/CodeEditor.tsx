import { useRef, useEffect } from "react";
import Editor, {  type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import type { Page } from "../../constants/types";
import socket from "../../healper/socket";
import { useRoom } from "../../context/RoomContext";

interface CodeEditorProps {
  updatePageContent: (content: string) => void;
  darkMode: boolean;
  currentPage: Page;
}

// Map to Monaco-supported languages
const mapLanguage = (lang: string) => {
  switch (lang) {
    case "javascript":
    case "typescript":
    case "python":
    case "java":
    case "csharp":
    case "cpp":
    case "html":
    case "css":
      return lang;
    default:
      return "plaintext";
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  updatePageContent,
  darkMode,
  currentPage,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const preventLoop = useRef(false);
  const remoteDecorations = useRef<Record<string, string[]>>({}); // ✅ persist across renders
  const { roomId } = useRoom();

  // Mount editor + send changes
  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    editor.onDidChangeModelContent(() => {
      if (preventLoop.current) return;

      const value = editor.getValue();
      updatePageContent(value);

      // Broadcast code changes
      if (roomId) {
        socket.emit("editor-change", {
          roomId,
          content: value,
        });
      }
    });

    // Cursor movement
    editor.onDidChangeCursorPosition((e) => {
      if (roomId) {
        socket.emit("cursor-change", {
          roomId,
          position: e.position, // { lineNumber, column }
          userId: socket.id, // unique per connection
          username: "Ritesh", // replace with logged-in user’s name
        });
      }
    });
  };

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    const changeHandler = (data: { roomId: string; content: string }) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (editor.getValue() === data.content) return;

      preventLoop.current = true;
      editor.setValue(data.content);
      preventLoop.current = false;
    };

    const syncHandler = (data: { code: string }) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (editor.getValue() === data.code) return;

      preventLoop.current = true;
      editor.setValue(data.code);
      preventLoop.current = false;
    };

    const cursorHandler = (data: { userId: string; username: string; position: any }) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (data.userId === socket.id) return; // ignore self

      const range = new monaco.Range(
        data.position.lineNumber,
        data.position.column,
        data.position.lineNumber,
        data.position.column
      );

      // ✅ Replace old decoration with new one
      remoteDecorations.current[data.userId] = editor.deltaDecorations(
        remoteDecorations.current[data.userId] || [],
        [
          {
            range,
            options: {
              className: `remote-cursor-${data.userId}`,
              afterContentClassName: `remote-cursor-label-${data.userId}`,
            },
          },
        ]
      );

      // Inject styles only once
      if (!document.getElementById(`cursor-style-${data.userId}`)) {
        const color = "blue"; // TODO: assign unique color per user
        const newStyle = document.createElement("style");
        newStyle.id = `cursor-style-${data.userId}`;
        newStyle.innerHTML = `
          /* vertical line */
          .remote-cursor-${data.userId} {
            border-left: 2px solid ${color};
            margin-left: -1px;
          }

          /* username label (inline, next to cursor) */
          .remote-cursor-label-${data.userId}::after {
            content: "${data.username}";
            background: white;
            color: ${color};
            border: 1px solid ${color};
            font-size: 11px;
            font-weight: 600;
            padding: 2px 4px;
            border-radius: 3px;
            margin-left: 2px;
          }
        `;
        document.head.appendChild(newStyle);
      }
    };

    socket.on("editor-change", changeHandler);
    socket.on("editor-sync", syncHandler);
    socket.on("cursor-change", cursorHandler);

    return () => {
      socket.off("editor-change", changeHandler);
      socket.off("editor-sync", syncHandler);
      socket.off("cursor-change", cursorHandler);
    };
  }, [roomId]);

  return (
    <Editor
      key={currentPage.id}
      height="100%"
      language={mapLanguage(currentPage.language)}
      value={currentPage.content}
      onMount={onMount}
      theme={darkMode ? "vs-dark" : "light"}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
