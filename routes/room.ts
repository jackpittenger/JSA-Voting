import { Router, Response } from "express";
import pin from "./helpers/pin";

import type { PrismaClient } from "@prisma/client";
import { Request, Query, Params } from "../types/post";
import { RoomPostBody } from "../types/room";

class Room {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }

  setup(): Router {
    this.router.get("", (req: Request, res: Response) => {
      return res.status(200).send();
    });
    this.router.post(
      "",
      async (req: Request<RoomPostBody, Query, Params>, res: Response) => {
        if (
          !req.body.name ||
          req.body.name.length > 48 ||
          req.body.name.length < 1
        )
          return res.status(400).json({
            error: "Missing 'name', which must be between 1 and 48 characters",
          });
        try {
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
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }
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

export default Room;
