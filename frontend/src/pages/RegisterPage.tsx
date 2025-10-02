import { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useRoom } from "../context/RoomContext";
import socket from "../healper/socket";
import { useSocket } from "../context/SocketContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [joinId, setJoinId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const { setRoomId } = useRoom();
  const { setSocketId } = useSocket(); // <-- Added

  // Apply dark/light mode globally
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // ---- Auto join room if data in localStorage ----
  useEffect(() => {
    const storedRoom = localStorage.getItem("roomId");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedRoom && storedUsername && storedEmail) {
      setRoomId(storedRoom);
      setUsername(storedUsername);
      setEmail(storedEmail);

      socket.emit("join-room", { roomId: storedRoom, userId: storedUsername });
      setSocketId(socket.id); // Save socket ID
      navigate(`/room/${storedRoom}`);
    }
  }, []);

  // ---- Create Room ----
  const handleCreateRoom = async () => {
    if (!username || !email) {
      alert("Username and Email are required!");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register-create`, { username, email });

      if (res.status === 200) {
        const roomId = res.data.roomId;
        const username = res.data.username;
        const email = res.data.email;

        setRoomId(roomId);
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        // Save socket ID in context
        setSocketId(socket.id);

        // Join the room via socket
        socket.emit("join-room", { roomId, userId: username });

        navigate(`/room/${roomId}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong while creating the room.");
    }
  };

  // ---- Join Room ----
  const handleJoinRoom = async () => {
    if (!username || !email || !joinId) {
      alert("Username, Email, and Join ID are required!");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register-join`, { username, email, roomId: joinId });

      if (res.status === 200) {
        setRoomId(res.data.roomId);
        localStorage.setItem("roomId", res.data.roomId);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        setSocketId(socket.id);

        socket.emit("join-room", { roomId: res.data.roomId, userId: username });

        navigate(`/room/${res.data.roomId}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong while joining the room.");
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute right-4 top-4 rounded-full p-2 ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-800"}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <h1 className={`text-2xl font-bold text-center ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Register & Join Room</h1>

        {/* Username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={`mt-4 w-full rounded-lg p-2 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        />

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`mt-4 w-full rounded-lg p-2 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        />

        {/* Join ID */}
        <input
          type="text"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          placeholder="Join ID (optional)"
          className={`mt-4 w-full rounded-lg p-2 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button onClick={handleJoinRoom} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg">Join Room</button>
          <button onClick={handleCreateRoom} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg">Create Room</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
