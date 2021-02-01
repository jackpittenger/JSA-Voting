import { Router, Response } from "express";

import { passToken } from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";

import { paramValid } from "./helpers/paramValid";
import pin from "./helpers/pin";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type { RoomPostBody } from "../types/room";
import type { VoterToken } from "../types/voter";

export default class Room {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }

  setup(): Router {
    this.router.get(
      "",
      errorWrapper((req: Request, res: Response) => {
        return res.status(200).send();
      })
    );
    this.router.post(
      "",
      errorWrapper(
        async (req: Request<RoomPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.name, 1, 48, "name");
          const room = await this.prisma.room.create({
            data: {
              name: req.body.name,
              accessCode: pin(7),
              Convention: {
                connect: {
                  id: 1,
                },
              },
            },
          });
          return res.status(201).json({ result: room });
        }
      )
    );
    this.router.get(
      "/speakers",
      passToken,
      async (req: Request, res: Response) => {
        const token: VoterToken = req.body._token;
        const room = await this.prisma.room.findUnique({
          where: {
            accessCode: token.room.accessCode,
          },
          select: {
            id: true,
            speakers: true,
          },
        });
        if (!room.id) return res.status(400).json({ error: "Room not found!" });
        return res.status(200).json({ speakers: room.speakers });
      }
    );
    this.router.patch("/conclude", (req: Request, res: Response) => {});
    this.router.patch("/byline", (req: Request, res: Response) => {});
    this.router.patch("/toggle", (req: Request, res: Response) => {});
    this.router.delete("", (req: Request, res: Response) => {});
    this.router.delete("/all", (req: Request, res: Response) => {});
    return this.router;
  }
}
