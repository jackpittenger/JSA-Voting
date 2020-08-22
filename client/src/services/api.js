import openSocket from "socket.io-client";

export default function openSoc(token) {
  let socket = openSocket(
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://jsavote.com:8443"
  );
  socket.emit("token", token);
  socket.on("unauthorized", () => socket.disconnect());
  return socket;
}
