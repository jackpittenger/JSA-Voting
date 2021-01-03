import { Router } from "express";
import jwt from "jsonwebtoken";

import auth from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";

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
      auth(Role.ADMIN),
      errorWrapper(
        async (req: Request<AccountPostBody, Query, Params>, res: Response) => {
          if (
            !req.body.token ||
            req.body.token.length > 48 ||
            req.body.token.length < 1
          )
            return res.status(400).json({
              error:
                "Missing 'token', which must be between 1 and 48 characters",
            });
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
          res.status(201).json(account);
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
          if (
            !req.body.token ||
            req.body.token.length > 48 ||
            req.body.token.length < 1
          )
            return res.status(400).json({
              error:
                "Missing 'token', which must be between 1 and 48 characters",
            });
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
          if (
            !req.body.token ||
            req.body.token.length > 48 ||
            req.body.token.length < 1
          )
            return res.status(400).json({
              error:
                "Missing 'token', which must be between 1 and 48 characters",
            });
          if (!req.body.pin || req.body.pin.length != 7)
            return res.status(400).json({
              error: "Missing 'pin', which must be 7 characters",
            });
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
