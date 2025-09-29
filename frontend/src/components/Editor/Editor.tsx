import { Code } from "lucide-react";
import CodeEditor from "./CodeEditor";
import type { Page } from "../../constants/types";

interface EditorProps {
  currentPage: Page | undefined;
  updatePageContent: (content: string) => void;
  darkMode: boolean;
}

const Editor: React.FC<EditorProps> = ({ currentPage, updatePageContent, darkMode }) => {

 

  if (!currentPage) {
    return (
      <div
        className={`flex items-center justify-center h-full rounded-lg border-2 border-dashed ${
          darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-300"
        }`}
      >
        <div className="text-center">
          <Code
            className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No file selected
          </h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Create a new page or select an existing one to start coding
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col">
      {/* File Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{currentPage.name}</span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-700 rounded">
              {currentPage.language}
            </span>
          </div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full "></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className= {`flex-1 p-0 `}>
        <CodeEditor
          updatePageContent={updatePageContent}
          currentPage={currentPage}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Editor;
