import { Router, Response } from "express";
import jwt from "jsonwebtoken";

import { Vote } from "@prisma/client";

import { paramValid, paramValidEnum } from "./helpers/paramValid";

import { passToken, roleVerify } from "./middleware/auth";
import { errorWrapper, BadRequest } from "./middleware/errors";
import passConventionRoom from "./middleware/passConventionRoom";

import { Role } from "@prisma/client";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type {
  SpeakerPostBody,
  VoterDeleteBody,
  VotePostBody,
  VoterPostBody,
} from "../types/voter";
import type SocketHandler from "./middleware/socketHandler";

export default class Voter {
  router: Router;
  prisma: PrismaClient;
  socketHandler: SocketHandler;

  constructor(prisma: PrismaClient, socketHandler: SocketHandler) {
    this.router = Router();
    this.prisma = prisma;
    this.socketHandler = socketHandler;
  }

  setup(): Router {
    this.router.post(
      "",
      errorWrapper(
        async (req: Request<VoterPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.firstName, 1, 48, "firstName");
          paramValid(req.body.lastName, 1, 48, "lastName");
          paramValid(req.body.school, 1, 48, "school");
          paramValid(req.body.code, 7, 7, "code");
          const room = await this.prisma.room.findUnique({
            where: {
              accessCode: req.body.code,
            },
            select: {
              id: true,
              open: true,
            },
          });
          if (!room) throw new BadRequest("Invalid code!");
          if (!room.open) throw new BadRequest("This room isn't open!");
          const exists = await this.prisma.voter.findFirst({
            where: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              school: req.body.school,
              roomId: room.id,
            },
          });
          if (exists) throw new BadRequest("Voter already exists!");
          const voter = await this.prisma.voter.create({
            data: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              school: req.body.school,
              Room: {
                connect: { id: room.id },
              },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              school: true,
              vote: true,
              speaker: true,
              Room: {
                select: {
                  id: true,
                  name: true,
                  accessCode: true,
                },
              },
            },
          });
          const token = jwt.sign(
            {
              firstName: voter.firstName,
              lastName: voter.lastName,
              school: voter.school,
              room: {
                name: voter.Room.name,
                accessCode: voter.Room.accessCode,
              },
            },
            process.env.SECRET,
            { expiresIn: "8h" }
          );
          res.status(200).json({ token: token });
          const roomID = voter.Room.id;
          delete voter["Room"];
          return this.socketHandler.sendNewVoter(voter, roomID);
        }
      )
    );
    this.router.post(
      "/vote",
      passToken,
      errorWrapper(
        async (req: Request<VotePostBody, Query, Params>, res: Response) => {
          paramValidEnum(req.body.vote, "vote", ["YEA", "NAY", "ABS"]);
          const room = await this.prisma.room.findUnique({
            where: {
              accessCode: req.body._token.room.accessCode,
            },
            select: {
              id: true,
              votingOpen: true,
            },
          });
          if (!room) throw new BadRequest("Invalid room!");
          if (!room.votingOpen)
            throw new BadRequest(
              "Room not open for voting! Wait for your moderator"
            );
          const voter = await this.prisma.voter.findFirst({
            where: {
              firstName: req.body._token.firstName,
              lastName: req.body._token.lastName,
              school: req.body._token.school,
              roomId: room.id,
            },
            select: {
              id: true,
              vote: true,
            },
          });
          if (voter.vote !== null)
            throw new BadRequest("You've already voted!");
          await this.prisma.voter.update({
            where: {
              id: voter.id,
            },
            data: {
              vote: Vote[req.body.vote],
            },
          });
          res.status(200).json({ success: true });
          this.socketHandler.sendVoteUpdate(
            { id: voter.id, vote: req.body.vote },
            room.id
          );
        }
      )
    );
    this.router.post(
      "/speaker",
      passToken,
      errorWrapper(
        async (req: Request<SpeakerPostBody, Query, Params>, res: Response) => {
          const room = await this.prisma.room.findUnique({
            where: {
              accessCode: req.body._token.room.accessCode,
            },
            select: {
              id: true,
              votingOpen: true,
              speakers: true,
            },
          });
          paramValidEnum(req.body.speaker, "speaker", room.speakers);
          if (!room.votingOpen) throw new BadRequest("Voting not open!");
          const voter = await this.prisma.voter.findFirst({
            where: {
              firstName: req.body._token.firstName,
              lastName: req.body._token.lastName,
              school: req.body._token.school,
              roomId: room.id,
            },
            select: {
              id: true,
              speaker: true,
            },
          });
          if (voter.speaker !== null)
            throw new BadRequest("You've already selected a speaker!");
          await this.prisma.voter.update({
            where: {
              id: voter.id,
            },
            data: {
              speaker: req.body.speaker,
            },
          });
          res.status(200).json({ success: true });
          this.socketHandler.sendSpeakerUpdate(
            { id: voter.id, speaker: req.body.speaker },
            room.id
          );
        }
      )
    );
    return this.router;
  }
}
