import { io } from "socket.io-client";

// A single shared socket connection for the whole app (tracking updates,
// future order/inventory live events). Created lazily so it isn't opened
// before the app actually needs it.
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};
