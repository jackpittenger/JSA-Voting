import io from "socket.io-client";

export default function openRoomSocket(token, room) {
  let url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/room"
      : "https://jsavote.com:8443/room";
  let socket = io(url, {
    query: { token: token, room: room },
  });
  socket.on("error", (e) => console.log(e));
  socket.on("unauthorized", () => socket.disconnect());
  return socket;
}
