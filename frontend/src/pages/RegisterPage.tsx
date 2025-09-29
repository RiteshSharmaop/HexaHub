import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // assuming you use react-router
import { useRoom } from "../context/RoomContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [joinId, setJoinId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // for navigation after success
  

  const { roomId , setRoomId } = useRoom();

  // Apply dark/light mode globally
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Create Room
  const handleCreateRoom = async () => {
    if (!username || !email) {
      alert("Username and Email are required!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/register-create", {
        username,
        email,
      });

      if (res.status === 200) {
        alert(`Room created! ID: ${res.data.roomId}`);
        setRoomId(res.data.roomId)
        localStorage.setItem("roomId" , res.data.roomId);
        navigate(`/room/${res.data.roomId}`, { state: { username, email } });
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert(err.response.data.error);
      } else {
        console.error(err);
        alert("Something went wrong while creating the room.");
      }
    }
  };

  // Join Room
  const handleJoinRoom = async () => {
    if (!username || !email || !joinId) {
      alert("Username, Email, and Join ID are required!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/register-join", {
        username,
        email,
        roomId: joinId,
      });

      if (res.status === 200) {
        alert(`Joined room: ${res.data.roomId}`);
        setRoomId(res.data.roomId)
        localStorage.setItem("roomId" , res.data.roomId);
        navigate(`/room/${res.data.roomId}`, { state: { username, email } });
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        alert(err.response.data.error);
      } else if (err.response?.status === 409) {
        alert(err.response.data.error);
      } else {
        console.error(err);
        alert("Something went wrong while joining the room.");
      }
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl p-8 shadow-xl transition-colors duration-500 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute right-4 top-4 rounded-full p-2 transition-all duration-300 cursor-pointer ${
            darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-800"
          } hover:scale-110`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Title */}
        <h1
          className={`text-2xl font-bold text-center transition-colors duration-500 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Register & Join Room
        </h1>

        {/* Username */}
        <div className="mt-6">
          <label
            className={`block text-sm font-medium transition-colors duration-500 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter unique username"
            className={`mt-1 w-full rounded-lg border p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-colors duration-500 ${
              darkMode
                ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400"
                : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label
            className={`block text-sm font-medium transition-colors duration-500 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter unique email"
            className={`mt-1 w-full rounded-lg border p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-colors duration-500 ${
              darkMode
                ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400"
                : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Join ID */}
        <div className="mt-4">
          <label
            className={`block text-sm font-medium transition-colors duration-500 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Join ID (Optional)
          </label>
          <input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter room ID if joining"
            className={`mt-1 w-full rounded-lg border p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-colors duration-500 ${
              darkMode
                ? "border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400"
                : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleJoinRoom}
            className="flex-1 rounded-lg cursor-pointer bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors duration-300"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            className="flex-1 rounded-lg cursor-pointer bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors duration-300"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
