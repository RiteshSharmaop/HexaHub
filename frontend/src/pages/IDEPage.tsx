import { useEffect, useState } from "react";
import { languages } from "../constants/language";
import { connectedUsers } from "../constants/user";
import { CODE_SNIPPETS } from "../constants/language";
import {
    Trash2, User, Play, Share, MoreHorizontal,
    ChevronDown, Code, X, Sun, Moon, Square
} from "lucide-react";
import Editor from "../components/Editor/Editor";
import { runTheCode } from "../healper/healper";
import socket from "../healper/socket";
import { useRoom } from "../context/RoomContext";
import CollaborateButton from "../components/Buttons/CollaborateButton";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

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
        id: number;
        name: string;
        language: string;
        content: string;
    }>({
        id: 1,
        name: "main.js",
        language: "javascript",
        content: CODE_SNIPPETS["javascript"],
    });
//     const [showBox, setShowBox] = useState(false);
//     const [copied, setCopied] = useState(false);

//     const shareLink = "https://yourapp.com/room/68da76fd-0c8c-8326-af49-24f7dc286a37";
//      const copyToClipboard = () => {
//     navigator.clipboard.writeText(shareLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

    const { roomId } = useRoom();

    const {socketId , setSocketId} = useSocket();

    const navigate = useNavigate()


    // Helper → map language to filename
    const getFileName = (lang: string) => {
        switch (lang) {
            case "javascript": return "main.js";
            case "typescript": return "main.ts";
            case "python": return "main.py";
            case "java": return "main.java";
            case "csharp": return "main.cs";
            default: return "main.cpp";
        }
    };


    useEffect(()=>{
        
    },[])


    useEffect(()=>{
    
        
        if(!socket.id ){
            navigate("/" , {  });
        }
        setSocketId(socket.id);
        console.log("Socket Id " , socketId );
        
    },[])
    
    
    useEffect(() => {
        if (!socket.connected) {
            socket.on("connect", () => {
                setSocketId(socket.id);
                console.log("Socket connected with ID:", socket.id);
            });
        } else {
            setSocketId(socket.id);
        }
    }, []);


    // Join room and sync last code
    useEffect(() => {
        if (!roomId) return;

        socket.emit("join-room", roomId);

        const syncHandler = (data: { code: string }) => {
            setCurrentPage((prev) => ({
                ...prev,
                content: data.code,
            }));
        };

        socket.on("editor-sync", syncHandler);

        return () => {
            socket.off("editor-sync", syncHandler);
        };
    }, [roomId]);

    


    // Listen for language changes
    useEffect(() => {
        const langHandler = (data: { language: string }) => {
            const lang = data.language;
            console.log("Language changed in room:", lang);

            setSelectedLanguage(lang);
            setCurrentPage((prev) => ({
                ...prev,
                language: lang,
                name: getFileName(lang),
                content: CODE_SNIPPETS[lang] || prev.content,
            }));
        };

        socket.on("changing-language", langHandler);

        return () => {
            socket.off("changing-language", langHandler);
        };
    }, []);


    const handleLogout = ()=>{
        setShowUserDropdown(false);
        localStorage.removeItem("email")
        localStorage.removeItem("username")
        localStorage.removeItem("roomId")
        navigate("/")
    }

    // Handle local language change
    const handleLanguageChange = (langValue: string) => {
        setSelectedLanguage(langValue);
        setShowLanguageDropdown(false);

        setCurrentPage({
            id: 1,
            language: langValue,
            name: getFileName(langValue),
            content: CODE_SNIPPETS[langValue],
        });

        if (roomId) {
            socket.emit("change-lang", {
                roomId,
                language: langValue,
            });
        }
    };

    // Update code locally
    const updatePageContent = (content: string) => {
        setCurrentPage((prev) => ({
            ...prev,
            content,
        }));
    };


    useEffect(() => {
        const outputHandler = (data: { output: string; errors: string; userId: string }) => {
            setTerminalOutput(data.output || "");
            setTerminalErrors(data.errors || "No errors detected.");
            setTerminalTab(data.errors ? "errors" : "output");
            setIsRunning(false);
            setShowTerminal(true);
        };

        socket.on("run-code-output", outputHandler);

        return () => {
            socket.off("run-code-output", outputHandler);
        };
    }, []);

    // Run code in terminal
    const runCode = async () => {
        if (!currentPage) return;

        setIsRunning(true);
        setShowTerminal(true);

        
        // Broadcast run event to all room members
        if (roomId) {
            socket.emit("run-code", {
                roomId,
                language: currentPage.language,
                content: currentPage.content,
                userId: socketId
            });
        }
        try {
            const res = await runTheCode(currentPage.language, currentPage.content);

            if (res.stderr) {
                setTerminalOutput(res.stderr);
                setTerminalErrors(`ERROR: ${res.stderr}`);
                setTerminalTab("errors");
                setTimeout(() => setTerminalTab("output"), 2000);
                return;
            }
            
            setTerminalOutput(res.output);
            setTerminalErrors("No errors detected.");
            setTerminalTab("output");
        } catch (err: any) {
            setTerminalOutput(`${err.message || err}`);
            setTerminalErrors(`ERROR: ${err.message || err}`);
            setTerminalTab("errors");
        } finally {
            setIsRunning(false);
        }
    };
    useEffect(() : any => {
        const runHandler = async (data: { language: string; content: string; userId: string }) => {
            // Skip if it was this user's own request
            if (data.userId === socketId) return;

            setIsRunning(true);
            setShowTerminal(true);

            try {
                const res = await runTheCode(data.language, data.content);

                if (res.stderr) {
                    setTerminalOutput(res.stderr);
                    setTerminalErrors(`ERROR: ${res.stderr}`);
                    setTerminalTab("errors");
                    return;
                }

                setTerminalOutput(res.output);
                setTerminalErrors("No errors detected.");
                setTerminalTab("output");
            } catch (err: any) {
                setTerminalOutput(`${err.message || err}`);
                setTerminalErrors(`ERROR: ${err.message || err}`);
                setTerminalTab("errors");
            } finally {
                setIsRunning(false);
            }
        };

        socket.on("run-code", runHandler);
        return () => socket.off("run-code", runHandler);
    }, [socketId]);


    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className={`flex h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
            {/* Sidebar */}
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-r transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden flex flex-col`}>
                <div className={`p-4 border-b flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Code className="w-4 h-4 text-white" />
                            </div>
                            <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>HexaHub</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className={`p-1 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                            <X className="w-4 h-4 cursor-pointer" />
                        </button>
                    </div>
                </div>

                {/* Connected Users */}
                <div className={`border-t p-4 flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Connected Users
                    </h3>
                    <div className="space-y-2">
                        {connectedUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                                        {user.avatar}
                                    </div>
                                    <div
                                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${user.online ? "bg-green-400" : "bg-gray-400"
                                            }`}
                                    />
                                </div>
                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <div className={`border-b px-4 py-3 flex-shrink-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                >
                                    <Code className="w-5 h-5 cursor-pointer" />
                                </button>
                            )}

                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer ${darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <Code className="w-4 h-4 cursor-pointer" />
                                    <span>{languages.find((lang) => lang.value === selectedLanguage)?.label}</span>
                                    <ChevronDown className="w-4 h-4 cursor-pointer" />
                                </button>

                                {showLanguageDropdown && (
                                    <div
                                        className={`absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-10 min-w-40 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => handleLanguageChange(lang.value)}
                                                className={`w-full cursor-pointer flex items-center space-x-2 px-4 py-2 text-left text-sm ${darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-50"
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

                        {/* Run & Terminal */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${isRunning
                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                            >
                                <Play className="w-4 h-4" />
                                <span>{isRunning ? "Running..." : "Run Code"}</span>
                            </button>
                            <button
                                onClick={() => setShowTerminal(!showTerminal)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${showTerminal
                                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                                        : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                            >
                                <Square className="w-4 h-4" />
                                <span>Terminal</span>
                            </button>
                            {/* <button className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                                <Users className="w-4 h-4" />
                                <span>Collaborate</span>
                            </button> */}
                            <CollaborateButton />
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
                                            onClick={handleLogout}
                                            className={`w-full px-4 py-2 text-left text-sm text-red-600 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 p-4 overflow-hidden">
                    <Editor
                        currentPage={currentPage}
                        updatePageContent={updatePageContent}
                        darkMode={darkMode}
                    />
                </div>

                {/* Terminal */}
                {showTerminal && (
                    <div className={`border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} h-1/2 flex flex-col`}>
                        <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setTerminalTab("output")}
                                    className={`px-3 py-1 text-sm cursor-pointer rounded ${terminalTab === "output"
                                            ? darkMode
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-200 text-gray-900"
                                            : darkMode
                                                ? "text-gray-400 hover:text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    Output
                                </button>
                                <button
                                    onClick={() => setTerminalTab("errors")}
                                    className={`px-3 py-1 cursor-pointer text-sm rounded ${terminalTab === "errors"
                                            ? darkMode
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-200 text-gray-900"
                                            : darkMode
                                                ? "text-gray-400 hover:text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    Errors
                                </button>
                            </div>
                            <button
                                onClick={() => setShowTerminal(false)}
                                className={`p-1 rounded cursor-pointer ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-600"
                                    }`}
                            >
                                <X className="w-4 h-4 cursor-pointer" />
                            </button>
                        </div>

                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
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
