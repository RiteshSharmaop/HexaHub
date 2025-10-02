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
import dotenv from "dotenv";
dotenv.config();




const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to Redis
import { client } from "./db/redis.ts";






io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("join-room", async (data) => {
    const { roomId, userId } = data;
    if (!roomId || !userId) {
      console.error("join-room missing data", data);
      return;
    }

    socket.join(roomId);
    console.log(`User ${userId} rejoined room ${roomId}`);

    // Fetch last code from Redis using the same key as Express
    const lastCode = (await client.get(`HexaHub:Editor:${roomId}`)) || "";
    socket.emit("editor-sync", { code: lastCode });
  });

  // Save editor changes
  socket.on("editor-change", async (data: { roomId: string; content: string }) => {
    const { roomId, content } = data;
    if (!roomId || content === undefined) return;

    await client.set(`HexaHub:Editor:${roomId}`, content);
    socket.to(roomId).emit("editor-change", { roomId, content });
  });


  socket.on("change-lang", (data: { roomId: string; language: string }) => {
    console.log("Socket : chaning languafge ", data);

    const { roomId, language } = data;
    socket.to(roomId).emit("changing-language", { language });
  })
  
  
  
   // Listen for run-code
  // socket.on("run-code", async ({ roomId, language, content, userId }) => {
  //   try {
  //     const result = await runTheCode(language, content);

  //     const output = result.stdout || "";
  //     const errors = result.stderr || "";

  //     // Broadcast output to all users in the room
  //     io.to(roomId).emit("run-code-output", {
  //       output,
  //       errors,
  //       userId,
  //     });
  //   } catch (err: any) {
  //     io.to(roomId).emit("run-code-output", {
  //       output: "",
  //       errors: err.message || "Error running code",
  //       userId,
  //     });
  //   }
  // });

  // Forward run event to all users in the room
    socket.on("run-code", ({ roomId, language, content, userId }) => {
      socket.to(roomId).emit("run-code", { language, content, userId });
    });


    // ✅ Handle cursor changes
  socket.on("cursor-change", (data: { roomId: string; position: any; userId: string; username: string }) => {
    socket.to(data.roomId).emit("cursor-change", data);
  });

  socket.on("disconnect", () => {

    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server started on port ${PORT}`);
});
