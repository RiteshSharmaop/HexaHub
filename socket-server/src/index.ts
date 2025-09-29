// import { createServer } from "http";
// import { Server } from "socket.io";

// const httpServer = createServer();
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", // allow any frontend
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// io.on("connection", (socket) => {
//   console.log("Socket Connected:", socket.id);

//   // Join a room for a specific page/file
//   socket.on("join-room", (roomId: string) => {
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined Room ${roomId}`);
//   });

//   // Listen for editor changes from clients
//   socket.on("editor-change", (data: { roomId: string; content: string }) => {
//     const { roomId, content } = data;

//     // Broadcast changes to all other users in the same room
//     socket.to(roomId).emit("editor-change", { roomId, content });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// const PORT = 5000;
// httpServer.listen(PORT, '0.0.0.0', () => {
//   console.log(`WebSocket server started on port ${PORT}`);
// });



import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to Redis
const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // Join a room
  socket.on("join-room", async (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined Room ${roomId}`);

    // Fetch last code from Redis
    const lastCode = (await redisClient.get(roomId)) || "";
    socket.emit("editor-sync", { code: lastCode });
  });

  // Listen for editor changes
  socket.on("editor-change", async (data: { roomId: string; content: string }) => {
    const { roomId, content } = data;

    // Save latest code to Redis
    await redisClient.set(roomId, content);

    // Broadcast to other users in the room
    socket.to(roomId).emit("editor-change", { roomId, content });
  });

  socket.on("change-lang" ,(data: { roomId: string; language: string })=>{
    console.log("Socket : chaning languafge " , data);
    
    const {roomId , language} = data;
    socket.to(roomId).emit("changing-language" , {language});
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server started on port ${PORT}`);
});
