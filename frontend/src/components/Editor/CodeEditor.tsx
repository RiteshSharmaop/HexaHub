import { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { Page } from "../../constants/types";

interface CodeEditorProps {
  updatePageContent: (content: string) => void;
  darkMode: boolean;
  currentPage: Page;
}

// 🔑 Map your language to Monaco supported languages
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

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  
  return (
    <Editor
      key={currentPage.id} // ensures re-render when file changes
      height="100%"        // ✅ fills parent instead of 100vh
      language={mapLanguage(currentPage.language)}
      value={currentPage.content}
      onChange={(value) => updatePageContent(value || "")}
      onMount={onMount}
      theme={!darkMode ? "light" : "vs-dark"}
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
