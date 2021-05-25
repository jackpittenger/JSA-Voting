import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import type { Token } from "../../types/jwt";

var roomListener;

export function setup(io: Server) {
  roomListener = io.of("/room");
  setupRoomIO(roomListener);
}

function setupRoomIO(io: Server) {
  // Verify token input
  io.use((socket: Socket, next: Function) => {
    console.log("IO USE");
    try {
      const passedToken = socket.handshake.query.token;
      const room = socket.handshake.query.room;
      //@ts-ignore
      const token: Token = verify(passedToken, process.env.SECRET);
      console.log(token);
      console.log(room);
      // TODO: need to verify room!

      next();
    } catch {
      const err = new Error("Invalid token");
      //@ts-ignore
      err.data = { content: "Token invalid/missing" };
      next(err);
    }
  });

  // Add to map
  io.use((socket: Socket, next: Function) => {
    try {
      const room = socket.handshake.query.room;
      //    if (roomMap.has(room)) {
      //    roomMap.get(room).push(socket.id);
      // } else {
      //  roomMap.set(room, [socket.id]);
      // }
      // console.log(roomMap);
      socket.join(room);
      next();
    } catch {
      const err = new Error("Internal server error");
      //@ts-ignore
      err.data = { content: "Internal server error" };
      next(err);
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
      // const room = socket.handshake.query.room;
      //const map = roomMap.get(room);
      //if (map.length == 1) roomMap.delete(room);
      //else {
      //  map.splice(map.indexOf(socket.id), 1);
      //}
    });
  });
}

export function sendNewVoter(payload: any, room: number) {
  roomListener.to(room).emit("new_voter", payload);
}

//let sockets = [];
/*
module.exports.setup = (io) =>
  io.on("connection", (client) => {
    client.on("token", (data) => {
      jwt.verify(data, process.env.SECRET, (err, decoded) => {
        if (err || decoded.permission < 1)
          return client.emit("unauthorized", () => client.disconnect());
        /*       User.findOne({ token: decoded.token })
          .then((usr) => usr)
          .then((usr) => sockets.push([client, usr]))
          .catch((err) => console.error(err));
   */
//    });
// });
/*  client.on(
      "disconnect",
      () => (sockets = sockets.filter((c) => c[0] !== client))
    );*/
//});

/*
module.exports.newVoter = (payload, owner) =>
  sockets
    .filter((c) => c[1].token === owner.token)
    .forEach((v) => v[0].emit("newuser", payload));

module.exports.vote = (payload, owner) => {
  sockets
    .filter((c) => c[1]._id.toString() === owner.owner.toString())
    .forEach((v) => {
      v[0].emit("vote", payload);
    });
};
*/
