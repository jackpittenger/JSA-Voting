import { Router, Response } from "express";

import { passToken, roleVerify } from "./middleware/auth";
import { BadRequest, errorWrapper } from "./middleware/errors";

import { paramValid } from "./helpers/paramValid";
import pin from "./helpers/pin";

import { Role } from "@prisma/client";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type { RoomListBody, RoomListParams, RoomPostBody } from "../types/room";
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
    this.router.get(
      "/list/:convention/:per/:page",
      roleVerify(Role.MOD),
      passToken,
      errorWrapper(
        async (
          req: Request<RoomListBody, Query, RoomListParams>,
          res: Response
        ) => {
          paramValid(req.params.per, 1, 50, "per");
          paramValid(req.params.convention, 1, 1000000, "convention");
          paramValid(req.params.page, 1, 10000, "page");
          const per = parseInt(req.params.per);
          const convention = parseInt(req.params.convention);
          const page = parseInt(req.params.page);
          if (per < 0 || per > 50)
            throw new BadRequest("Improper number of per!");
          if (
            req.body._token.role !== Role.DEV &&
            req.body._token.conventionId !== convention
          )
            throw new BadRequest("Improper convention access!");
          const rooms = await this.prisma.room.findMany({
            where: {
              Convention: {
                id: convention,
              },
            },
            select: {
              name: true,
              accessCode: true,
            },
            take: per,
            skip: per * page,
          });
          return res.status(200).json(rooms);
        }
      )
    );
    this.router.post(
      "",
      roleVerify(Role.MOD),
      passToken,
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
              Creator: {
                connect: {
                  token: req.body._token.token,
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
