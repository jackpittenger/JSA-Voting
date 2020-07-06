import openSocket from "socket.io-client";

function openSoc(token) {
  let socket = openSocket("http://localhost:8000");
  socket.emit("token", token);
  socket.on("unauthorized", () => socket.disconnect());
  return socket;
}

export default openSoc;
