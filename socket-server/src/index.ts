import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

import { client } from "./db/redis.js";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://hexahub-mern.onrender.com", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("join-room", async ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    socket.join(roomId);
    const lastCode = (await client.get(`HexaHub:Editor:${roomId}`)) || "";
    socket.emit("editor-sync", { code: lastCode });
  });

  socket.on("editor-change", async ({ roomId, content }) => {
    if (!roomId || content === undefined) return;
    await client.set(`HexaHub:Editor:${roomId}`, content);
    socket.to(roomId).emit("editor-change", { roomId, content });
  });

  socket.on("change-lang", ({ roomId, language }) => {
    socket.to(roomId).emit("changing-language", { language });
  });

  socket.on("run-code", ({ roomId, language, content, userId }) => {
    socket.to(roomId).emit("run-code", { language, content, userId });
  });

  socket.on("cursor-change", (data: { roomId: string; position: any; userId: string; username: string }) => {
    socket.to(data.roomId).emit("cursor-change", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Use Render's PORT
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server started on port ${PORT}`);
});
