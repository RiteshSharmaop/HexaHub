import React, { useState } from 'react';
import { Code, Monitor, FileText, Play, Share, Users, ChevronDown, X, Sun, Moon, Square } from 'lucide-react';
import CodeEditor from '@monaco-editor/react';

const languages = [
  { value: "javascript", label: "JavaScript", icon: Code, defaultContent: "// JavaScript code\nconsole.log('Hello World');" },
  { value: "typescript", label: "TypeScript", icon: Code, defaultContent: "// TypeScript code\nconsole.log('Hello World');" },
  { value: "python", label: "Python", icon: Code, defaultContent: "# Python code\nprint('Hello World')" },
  { value: "html", label: "HTML", icon: Monitor, defaultContent: "<!-- HTML code -->\n<h1>Hello World</h1>" },
  { value: "css", label: "CSS", icon: Monitor, defaultContent: "/* CSS code */\nbody { margin: 0; }" },
  { value: "json", label: "JSON", icon: FileText, defaultContent: "{\n  \"message\": \"Hello World\"\n}" }
];

function Ide() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [codeContent, setCodeContent] = useState(languages.find(lang => lang.value === 'javascript')?.defaultContent || '');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('Welcome to HexaHub Terminal\n$ ');
  const [terminalErrors, setTerminalErrors] = useState('No errors detected.');
  const [terminalTab, setTerminalTab] = useState('terminal');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    setTerminalTab('output');

    setTimeout(() => {
      let result = '';
      if (selectedLanguage === 'javascript') result = 'Hello World!\n✅ JS executed successfully';
      else if (selectedLanguage === 'python') result = 'Hello World!\n✅ Python executed successfully';
      else if (selectedLanguage === 'html') result = 'HTML processed successfully';
      else if (selectedLanguage === 'css') result = 'CSS processed successfully';
      else result = `${selectedLanguage} executed successfully`;

      setTerminalOutput(result + '\n\n$ ');

      setTerminalErrors('No errors detected.\n✅ Code analysis passed');
      setIsRunning(false);
    }, 1000);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    const selected = languages.find(l => l.value === lang);
    setCodeContent(selected?.defaultContent || '');
    setShowLanguageDropdown(false);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r w-64 flex flex-col`}>
        <div className={`p-4 border-b flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>HexaHub</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Code className="w-4 h-4" />
              <span>{languages.find(lang => lang.value === selectedLanguage)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showLanguageDropdown && (
              <div className={`absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-10 min-w-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                {languages.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageSelect(lang.value)}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'}`}
                  >
                    <lang.icon className="w-4 h-4" />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className={`border-b px-4 py-3 flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedLanguage.toUpperCase()}</h1>
            <div className="flex items-center space-x-2">
              <button onClick={runCode} disabled={isRunning} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${isRunning ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4">
          <CodeEditor
            height="100%"
            language={selectedLanguage}
            value={codeContent}
            theme={darkMode ? 'vs-dark' : 'light'}
            onChange={(value: any) => setCodeContent(value || '')}
            options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} h-80 flex flex-col`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-1">
                {['terminal', 'output', 'errors'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTerminalTab(tab)}
                    className={`px-3 py-1 text-sm rounded ${terminalTab === tab ? (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900') : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTerminal(false)} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
              {terminalTab === 'terminal' && <div className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>HexaHub Terminal v1.0\nType 'help' for commands\n$</div>}
              {terminalTab === 'output' && <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>{terminalOutput}</div>}
              {terminalTab === 'errors' && <div className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}>{terminalErrors}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ide;
