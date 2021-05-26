import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import { verifyRoomIO } from "./auth";

import type { Token } from "../../types/jwt";
import type { PrismaClient } from "@prisma/client";

export default class SocketHandler {
  roomListener: Server;
  prisma: PrismaClient;

  constructor(io: Server, prisma: PrismaClient) {
    this.prisma = prisma;
    this.roomListener = io.of("/room");
    this.setupRoomIO(this.roomListener);
  }

  setupRoomIO(io: Server) {
    // Verify token input
    io.use(async (socket: Socket, next: Function) => {
      try {
        const passedToken = socket.handshake.query.token;
        const room = socket.handshake.query.room;
        //@ts-ignore
        const token: Token = verify(passedToken, process.env.SECRET);
        if (!(await verifyRoomIO(token, room, this.prisma))) throw new Error();
        next();
      } catch {
        const err = new Error("Invalid token");
        //@ts-ignore
        err.data = { error: "Token invalid/missing" };
        next(err);
      }
    });

    io.use((socket: Socket, next: Function) => {
      try {
        const room = socket.handshake.query.room;
        socket.join(room);
        next();
      } catch {
        const err = new Error("Internal server error");
        //@ts-ignore
        err.data = { error: "Internal server error" };
        next(err);
      }
    });

    io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {});
    });
  }

  sendNewVoter(payload: any, room: number) {
    this.roomListener.to(room).emit("new_voter", payload);
  }
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
