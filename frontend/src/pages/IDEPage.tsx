import { useEffect, useState } from 'react';
import { languages } from '../constants/language';
import { connectedUsers } from '../constants/user';
import { CODE_SNIPPETS } from '../constants/language';
import {
    Trash2,
    User,
    Users,
    Play,
    Share,
    MoreHorizontal,
    ChevronDown,
    Code,
    X,
    Sun,
    Moon,
    Square
} from 'lucide-react';
import Editor from '../components/Editor/Editor';
import { runTheCode } from '../healper/healper';






function IDEApplication1() {
    const [sidebarOpen, setSidebarOpen] = useState(true);


    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const [darkMode, setDarkMode] = useState(true);
    const [showMainActions, setShowMainActions] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalTab, setTerminalTab] = useState('terminal');
    const [terminalOutput, setTerminalOutput] = useState('Welcome to HexaHub Terminal\n$ ');
    const [terminalErrors, setTerminalErrors] = useState('No errors detected.');
    const [isRunning, setIsRunning] = useState(false);


    const [currentPage, setCurrentPage] = useState<{
        id:number;
        name: string;
        language: string;
        content: string;
    } | null>({
        id:1,
        name: "main.js",
        language: "javascript",
        content: CODE_SNIPPETS['javascript'], // ✅ Default snippet
    });



    const runCode = async () => {
    if (!currentPage) return;

    setIsRunning(true);
    setShowTerminal(true);

    try {
        const sourceCode = currentPage.content;
        const lang = currentPage.language;

        const res = await runTheCode(lang, sourceCode);

        const out = res.output;
        const err = res.stderr;

        if (err) {
            setTerminalOutput(err);                 // clear output
            setTerminalErrors(`ERROR: ${err}`);   // set errors
            setTerminalTab('errors');             // ✅ open errors tab
            setTimeout(()=>{
                setTerminalTab('output');             // ✅ open errors tab
            }, 2000)
            return;
        }

        setTerminalOutput(`${out}`);
        setTerminalErrors("No errors detected.");
        setTerminalTab('output');                // open output tab
    } catch (err: any) {
        setTerminalOutput(`${err.message || err}`);
        setTerminalErrors(`ERROR: ${err.message || err}`);
        setTerminalTab('errors');                 // ✅ open errors tab on exception
    } finally {
        setIsRunning(false);
    }
};




    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };


    const updatePageContent = (content: string) => {
        if (!currentPage) return;
        setCurrentPage({
            ...currentPage,
            content,
        });
    };

    const handleLanguageChange = (langValue: string) => {
        setSelectedLanguage(langValue);
        setShowLanguageDropdown(false);

        setCurrentPage({
            id:1,
            name: `main.${langValue === "javascript" ? "js" :
                langValue === "typescript" ? "ts" :
                    langValue === "python" ? "py" :
                        langValue === "java" ? "java" :
                            langValue === "csharp" ? "cs" : "cpp"}`,
            language: langValue,
            content: CODE_SNIPPETS[langValue] || "// Start coding here...",
        });
    };
    useEffect(() => {
        console.log("Curr edn ", currentPage);

    }, [currentPage, setCurrentPage])


    return (
        <div
            className={`flex h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"
                }`}>
            {/* Sidebar */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
                {/* Sidebar Header - Fixed */}
                <div className={`p-4 border-b flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Code className="w-4 h-4 text-white" />
                            </div>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>HexaHub</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <X className="w-4 h-4 cursor-pointer" />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="relative mb-4">
                        <div className={`flex items-center space-x-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                RS
                            </div>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ritesh Sharma</span>
                        </div>
                    </div>



                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {/* Pages List */}


                    {/* Trash */}

                </div>

                {/* Sidebar Footer - Connected Users - Fixed at bottom */}
                <div className={`border-t p-4 flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connected Users</h3>
                    <div className="space-y-2">
                        {connectedUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                                        {user.avatar}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${user.online ? 'bg-green-400' : 'bg-gray-400'
                                        }`} />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">


                {/* Top Navigation */}
                <div className={`border-b px-4 py-3 flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <Code className="w-5 h-5 cursor-pointer" />
                                </button>
                            )}



                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    <Code className="w-4 h-4 cursor-pointer" />
                                    <span>{languages.find(lang => lang.value === selectedLanguage)?.label}</span>
                                    <ChevronDown className="w-4 h-4 cursor-pointer" />
                                </button>

                                {showLanguageDropdown && (
                                    <div className={`absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-10 min-w-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => handleLanguageChange(lang.value)} // ✅ Use function
                                                className={`w-full cursor-pointer flex items-center space-x-2 px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <lang.icon className="w-4 h-4" />
                                                <span>{lang.label}</span>
                                            </button>
                                        ))}

                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={` cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${isRunning
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                <Play className="w-4 h-4" />
                                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                            </button>
                            <button
                                onClick={() => setShowTerminal(!showTerminal)}
                                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${showTerminal
                                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
                                    }`}
                            >
                                <Square className="w-4 h-4" />
                                <span>Terminal</span>
                            </button>
                            <button className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                                <Users className="w-4 h-4" />
                                <span>Collaborate</span>
                            </button>
                            <button className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                                <Share className="w-4 h-4" />
                                <span>Publish</span>
                            </button>


                            <div className="relative">
                                <button
                                    onClick={() => setShowMainActions(!showMainActions)}
                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {showMainActions && (
                                    <div className={`absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-20 min-w-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                        <button
                                            onClick={() => {
                                                setShowUserDropdown(!showUserDropdown);
                                                setShowMainActions(false);
                                            }}
                                            className={`w-full flex cursor-pointer items-center space-x-2 px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'}`}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleTheme();
                                                setShowMainActions(false);
                                            }}
                                            className={`w-full cursor-pointer flex items-center space-x-2 px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'}`}
                                        >
                                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                                        </button>
                                        <button className={`w-full flex cursor-pointer items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}>
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete Project</span>
                                        </button>
                                    </div>
                                )}

                                {/* User Profile Dropdown */}
                                {showUserDropdown && (
                                    <div className={`absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-30 min-w-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    JD
                                                </div>
                                                <div>
                                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>John Developer</div>
                                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>john@example.com</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowUserDropdown(false)}
                                            className={`w-full px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'}`}
                                        >
                                            Account Settings
                                        </button>
                                        <button
                                            onClick={() => setShowUserDropdown(false)}
                                            className={`w-full px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-50'}`}
                                        >
                                            Preferences
                                        </button>
                                        <button
                                            onClick={() => setShowUserDropdown(false)}
                                            className={`w-full px-4 py-2 text-left text-sm text-red-600 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor Area */}
                {/* Main Body (Editor + Terminal stacked like VS Code) */}
                <div className="flex-1 p-4 overflow-hidden">
    
                    <Editor
                        currentPage={currentPage || undefined}
                        updatePageContent={updatePageContent}
                        darkMode={darkMode}
                    />
                </div>

                    {/* Terminal slides up from bottom */}
                    {showTerminal && (
                        <div className={`border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} h-1/2 flex flex-col`}>
                            {/* Terminal Header */}
                            <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setTerminalTab("output")}
                                        className={`px-3 py-1 text-sm  cursor-pointer rounded ${terminalTab === "output"
                                            ? (darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900")
                                            : (darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")
                                            }`}
                                    >
                                        Output
                                    </button>
                                    <button
                                        onClick={() => setTerminalTab("errors")}
                                        className={`px-3 py-1 cursor-pointer text-sm rounded ${terminalTab === "errors"
                                            ? (darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900")
                                            : (darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")
                                            }`}
                                    >
                                        Errors
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowTerminal(false)}
                                    className={`p-1 rounded cursor-pointer ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}
                                >
                                    <X className="w-4 h-4 cursor-pointer" />
                                </button>
                            </div>

                            {/* Terminal Output */}
                            <div className="flex-1 p-4 font-mono text-sm  overflow-y-auto">
                                {terminalTab === "output" && (
                                    <div className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap`}>
                                        {terminalOutput}
                                    </div>
                                )}
                                {terminalTab === "errors" && (
                                    <div className={`${darkMode ? "text-red-400" : "text-red-600"}`}>
                                        {terminalErrors}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                




                {/* Terminal Footer Button */}
                {!showTerminal && (
                    <div className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <button
                            onClick={() => setShowTerminal(true)}
                            className={`w-full cursor-pointer px-4 py-3 text-left text-sm font-medium flex items-center space-x-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Square className="w-4 h-4" />
                            <span>Terminal - Click to open</span>
                        </button>
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default IDEApplication1;