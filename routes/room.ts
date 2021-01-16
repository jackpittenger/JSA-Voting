import { Router, Response } from "express";

import { errorWrapper } from "./middleware/errors";

import paramValid from "./helpers/paramValid";
import pin from "./helpers/pin";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type { RoomPostBody } from "../types/room";

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
          res.status(201).json({ result: room });
        }
      )
    );
    this.router.patch("/conclude", (req: Request, res: Response) => {});
    this.router.patch("/byline", (req: Request, res: Response) => {});
    this.router.patch("/toggle", (req: Request, res: Response) => {});
    this.router.delete("", (req: Request, res: Response) => {});
    this.router.delete("/all", (req: Request, res: Response) => {});
    return this.router;
  }
}
