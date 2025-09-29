// socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,   // reconnect automatically
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default socket;
