import { Router, Response } from "express";
import jwt from "jsonwebtoken";

import auth from "./middleware/auth";

import pin from "./helpers/pin";

import type { PrismaClient } from "@prisma/client";
import { Request, Query, Params } from "../types/post";
import {
  AccountDeleteBody,
  AccountLoginBody,
  AccountPostBody,
} from "../types/account";

class Account {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }

  setup(): Router {
    this.router.post(
      "",
      async (req: Request<AccountPostBody, Query, Params>, res: Response) => {
        if (
          !req.body.token ||
          req.body.token.length > 48 ||
          req.body.token.length < 1
        )
          return res.status(400).json({
            error: "Missing 'token', which must be between 1 and 48 characters",
          });
        try {
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
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err });
        }
      }
    );
    this.router.delete(
      "",
      async (req: Request<AccountDeleteBody, Query, Params>, res: Response) => {
        if (
          !req.body.token ||
          req.body.token.length > 48 ||
          req.body.token.length < 1
        )
          return res.status(400).json({
            error: "Missing 'token', which must be between 1 and 48 characters",
          });
        try {
          await this.prisma.account.delete({
            where: {
              token: req.body.token,
            },
          });
          return res.status(204).send();
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }
      }
    );
    this.router.post(
      "/login",
      async (req: Request<AccountLoginBody, Query, Params>, res: Response) => {
        if (
          !req.body.token ||
          req.body.token.length > 48 ||
          req.body.token.length < 1
        )
          return res.status(400).json({
            error: "Missing 'token', which must be between 1 and 48 characters",
          });
        if (!req.body.pin || req.body.pin.length != 7)
          return res.status(400).json({
            error: "Missing 'pin', which must be 7 characters",
          });
        try {
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
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err });
        }
      }
    );
    return this.router;
  }
}

export default Account;
