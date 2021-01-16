import { Router, Response } from "express";
import jwt from "jsonwebtoken";

import { paramValid, paramValidEnum } from "./helpers/paramValid";

import { errorWrapper, BadRequest } from "./middleware/errors";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type { VotePostBody, VoterPostBody } from "../types/voter";

export default class Voter {
  router: Router;
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
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
              firstName: true,
              lastName: true,
              school: true,
              Room: {
                select: {
                  name: true,
                },
              },
            },
          });
          const token = jwt.sign(
            {
              firstName: voter.firstName,
              lastName: voter.lastName,
              school: voter.school,
              room: voter.Room,
            },
            process.env.SECRET,
            { expiresIn: "8h" }
          );
          return res.status(200).json({ token: token });
        }
      )
    );
    this.router.post(
      "/vote",
      errorWrapper(
        async (req: Request<VotePostBody, Query, Params>, res: Response) => {
          paramValidEnum(req.body.vote, "vote", ["yea", "nay", "abs"]);
        }
      )
    );
    return this.router;
  }
}
