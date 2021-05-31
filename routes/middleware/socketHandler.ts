import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import { verifyRoomIO } from "./auth";

import type { Vote } from "@prisma/client";
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

  sendNewVoter(payload: any, room: number) {
    this.sendToRoom("new_voter", payload, room);
  }

  sendVoteUpdate(payload: { id: number; vote: Vote }, room: number) {
    this.sendToRoom("voter_voted", payload, room);
  }

  sendSpeakerUpdate(payload: { id: number; speaker: string }, room: number) {
    this.sendToRoom("speaker_vote", payload, room);
  }

  sendBylineUpdate(payload: { byline: string }, room: number) {
    this.sendToRoom("byline_updated", payload, room);
  }

  private setupRoomIO(io: Server) {
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

  private sendToRoom(message: string, payload: any, room: number) {
    this.roomListener.to(room).emit(message, payload);
  }
}
