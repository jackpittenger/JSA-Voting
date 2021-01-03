import { Router } from "express";

import auth from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";
import { BadRequest, NotFound } from "./middleware/errors";

import { Role } from "../types/enums";

import type { Request, Query } from "../types/post";
import type { PrismaClient } from "@prisma/client";
import type { Response } from "express";
import type { GetParams } from "../types/convention";

export default class Convention {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }
  setup(): Router {
    this.router.get(
      "/name/:name",
      errorWrapper(
        async (req: Request<Body, Query, GetParams>, res: Response) => {
          if (!req.params || !req.params.name) {
            throw new BadRequest("Missing 'name'!");
          }
          const convention = await this.prisma.convention.findUnique({
            where: {
              name: req.params.name,
            },
            select: {
              name: true,
              createdAt: true,
              roomsOpen: true,
            },
          });
          if (!convention) throw new NotFound("No convention found!");
          res.status(200).json({ convention: convention });
        }
      )
    );
    return this.router;
  }
}
