import { Router } from "express";
import jwt from "jsonwebtoken";

import { paramValid } from "./helpers/paramValid";

import { roleVerify } from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";
import { BadRequest, NotFound } from "./middleware/errors";

import pin from "./helpers/pin";

import { Role } from "../types/enums";

import type { PrismaClient } from "@prisma/client";
import type { Response } from "express";
import type { Request, Query, Params } from "../types/post";
import type {
  AccountDeleteBody,
  AccountLoginBody,
  AccountPostBody,
} from "../types/account";

export default class Account {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }

  setup(): Router {
    this.router.post(
      "",
      roleVerify(Role.ADMIN),
      errorWrapper(
        async (req: Request<AccountPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.token, 1, 48, "token");
          const account = await this.prisma.account.create({
            data: {
              token: req.body.token,
              pin: pin(7),
              Convention: {
                connect: {
                  id: 1,
                },
              },
            },
            select: {
              token: true,
              pin: true,
            },
          });
          return res.status(201).json(account);
        }
      )
    );
    this.router.delete(
      "",
      errorWrapper(
        async (
          req: Request<AccountDeleteBody, Query, Params>,
          res: Response
        ) => {
          paramValid(req.body.token, 1, 48, "token");
          await this.prisma.account.delete({
            where: {
              token: req.body.token,
            },
          });
          return res.status(204).send();
        }
      )
    );
    this.router.post(
      "/login",
      errorWrapper(
        async (
          req: Request<AccountLoginBody, Query, Params>,
          res: Response
        ) => {
          paramValid(req.body.token, 1, 48, "token");
          paramValid(req.body.pin, 7, 7, "pin");
          const account = await this.prisma.account.findUnique({
            where: {
              token: req.body.token,
            },
            select: {
              token: true,
              pin: true,
              conventionId: true,
              role: true,
            },
          });
          if (!account || account.pin !== req.body.pin) {
            return res.status(400).json({ error: "Incorrect token/pin!" });
          }
          const token = jwt.sign(
            {
              token: account.token,
              conventionId: account.conventionId,
              role: account.role,
            },
            process.env.SECRET,
            { expiresIn: "7d" }
          );
          return res.status(200).json({ token: token });
        }
      )
    );
    return this.router;
  }
}
