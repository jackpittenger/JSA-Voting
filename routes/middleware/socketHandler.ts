import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import { verifyRoomIO } from "./auth";

import type { Vote } from "@prisma/client";
import type { Token } from "../../types/jwt";
import type { PrismaClient } from "@prisma/client";
import { errorWrapperSocket } from "./errors";

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

  sendOpenUpdate(payload: { open: boolean }, room: number) {
    this.sendToRoom("open_updated", payload, room);
  }

  sendVotingUpdate(payload: { votingOpen: boolean }, room: number) {
    this.sendToRoom("voting_updated", payload, room);
  }

  sendVoterDeletedUpdate(payload: { id: number }, room: number) {
    this.sendToRoom("voter_deleted", payload, room);
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
      const room = parseInt(socket.handshake.query.room);

      socket.on(
        "update_byline",
        errorWrapperSocket(
          async (data: { byline: string }) =>
            await this.updateByline(data, room)
        )
      );

      socket.on(
        "toggle_room",
        errorWrapperSocket(
          async (data: { open: boolean }) =>
            await this.updateRoomToggle(data, room)
        )
      );

      socket.on(
        "toggle_voting",
        errorWrapperSocket(
          async (data: { votingOpen: boolean }) =>
            await this.updateVotingToggle(data, room)
        )
      );

      socket.on(
        "delete_voter",
        errorWrapperSocket(
          this.requireNotConcluded(
            async (data: { id: number }) => await this.deleteVoter(data, room),
            room
          )
        )
      );

      socket.on("disconnect", () => {});
    });
  }

  private sendToRoom(message: string, payload: any, room: number) {
    this.roomListener.to(room).emit(message, payload);
  }

  private async updateByline(data: { byline: string }, room: number) {
    await this.prisma.room.updateMany({
      where: {
        id: room,
        concluded: false,
      },
      data: {
        byline: data.byline,
      },
    });
    this.sendBylineUpdate(data, room);
  }

  private async updateRoomToggle(data: { open: boolean }, room: number) {
    await this.prisma.room.updateMany({
      where: {
        id: room,
        concluded: false,
      },
      data: {
        open: data.open,
      },
    });
    this.sendOpenUpdate(data, room);
  }

  private async updateVotingToggle(
    data: { votingOpen: boolean },
    room: number
  ) {
    await this.prisma.room.updateMany({
      where: {
        id: room,
        concluded: false,
      },
      data: {
        votingOpen: data.votingOpen,
      },
    });
    this.sendVotingUpdate(data, room);
  }

  private async deleteVoter(data: { id: number }, room: number) {
    await this.prisma.voter.delete({
      where: {
        id: data.id,
      },
    });
    this.sendVoterDeletedUpdate(data, room);
  }

  private requireNotConcluded(fn: Function, roomNum: number) {
    return async function wrapped(data: {}, room: number) {
      const r = await this.prisma.room.findUnique({
        where: {
          id: roomNum,
        },
        select: {
          concluded: true,
        },
      });
      if (r === null || r.concluded) {
        // Already concluded!
        return;
      }
      return fn(data, room);
    }.bind(this);
  }
}
