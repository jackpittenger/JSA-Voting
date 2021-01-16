import { Router, Response } from "express";

import paramValid from "./helpers/paramValid";

import { errorWrapper } from "./middleware/errors";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type { VoterPostBody } from "../types/voter";

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
        (req: Request<VoterPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.firstName, 1, 48, "firstName");
          paramValid(req.body.lastName, 1, 48, "lastName");
          paramValid(req.body.school, 1, 48, "school");
          paramValid(req.body.code, 7, 7, "code");
        }
      )
    );

    return this.router;
  }
}
