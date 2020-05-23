import openSocket from "socket.io-client";

function openSoc(token) {
  let io = openSocket("http://localhost:8000");
  io.emit("token", token);
  return io;
}

export { openSoc };
