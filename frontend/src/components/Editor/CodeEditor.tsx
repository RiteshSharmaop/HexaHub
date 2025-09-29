import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
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
    case "javascript": return "javascript";
    case "typescript": return "typescript";
    case "python": return "python";
    case "java": return "java";
    case "csharp": return "csharp";
    case "cpp": return "cpp";
    case "html": return "html";
    case "css": return "css";
    default: return "plaintext";
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({ updatePageContent, darkMode, currentPage }) => {
  const editorRef = useRef<any>(null);
  const preventLoop = useRef(false);
  const { roomId } = useRoom();

  // Mount editor + send changes
  const onMount = (editor: any) => {
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
  };

  useEffect(() => {
    if (!roomId) return;

    // Join room
    socket.emit("join-room", roomId);

    // Listen for incoming changes
    const changeHandler = (data: { roomId: string; content: string }) => {
      const editor = editorRef.current;
      if (!editor) return;

      // Avoid resetting with same content
      if (editor.getValue() === data.content) return;

      preventLoop.current = true;
      editor.setValue(data.content);
      preventLoop.current = false;
    };

    // Sync last saved code
    const syncHandler = (data: { code: string }) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (editor.getValue() === data.code) return;

      preventLoop.current = true;
      editor.setValue(data.code);
      preventLoop.current = false;
    };

    socket.on("editor-change", changeHandler);
    socket.on("editor-sync", syncHandler);

    return () => {
      socket.off("editor-change", changeHandler);
      socket.off("editor-sync", syncHandler);
    };
  }, [roomId]);

  return (
    <Editor
      key={currentPage.id} // ensures re-render when file/language changes
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
