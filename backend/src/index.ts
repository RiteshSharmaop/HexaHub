


import express from "express";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors(
  {
    origin: process.env.FRONTEND_URI || " http://localhost:5173/", 
    methods: ["GET", "POST"], 
    credentials: true 
  }));



// Redis client

import { client } from "./db/redis.js";











// Helper to generate a unique 6-digit room ID
async function generateRoomId() {
  let id;
  do {
    id = Math.floor(100000 + Math.random() * 900000).toString();
  } while (await client.exists(`HexaHub:Room:${id}`));
  return id;
}

// Routes
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// Create Room
app.post("/register-create", async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  const roomId = await generateRoomId();

  // Store room in Redis with 1-day expiry
  await client.setEx(
    `HexaHub:Room:${roomId}`,
    86400,
    JSON.stringify({ createdBy: email })
  );

  // Store user in that room (Set so multiple users can join)
  await client.sAdd(`HexaHub:Room:${roomId}:users`, `${email} , ${username}`);
  await client.expire(`HexaHub:Room:${roomId}:users`, 86400);

  return res
    .status(200)
    .json({ message: "Room created", roomId, username, email });
});

// Join Room
app.post("/register-join", async (req, res) => {
  const { username, email, roomId } = req.body;

  if (!username || !email || !roomId) {
    return res
      .status(400)
      .json({ error: "Username, email, and roomId are required" });
  }

  const roomExists = await client.exists(`HexaHub:Room:${roomId}`);
  if (!roomExists) {
    return res
      .status(404)
      .json({ error: `Room ${roomId} not found or expired` });
  }

  const editor = await client.get(`HexaHub:Editor:${roomId}`);

  // Add user to room
  await client.sAdd(`HexaHub:Room:${roomId}:users`, `${email} , ${username}`);

  return res.status(200).json({
    message: "Joined room successfully",
    roomId,
    username,
    email,
    editor,
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
