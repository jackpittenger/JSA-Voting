import { Router } from "express";
import jwt from "jsonwebtoken";

import { paramValid, paramValidEnum } from "./helpers/paramValid";
import pin from "./helpers/pin";
import { roleEnumToNum } from "./helpers/enumToNum";

import { passToken } from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";
import { BadRequest } from "./middleware/errors";

import { Role } from "@prisma/client";

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
      passToken,
      errorWrapper(
        async (req: Request<AccountPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.token, 5, 24, "token");
          if (!req.body.type) throw new BadRequest("Missing/invalid 'type'!");
          paramValidEnum(req.body.type.toString(), "type", Object.values(Role));

          if (
            roleEnumToNum(req.body._token.role) <= roleEnumToNum(req.body.type)
          )
            throw new BadRequest("Not high enough permissions!");
          const account = await this.prisma.account.create({
            data: {
              token: req.body.token,
              pin: pin(7),
              role: req.body.type,
              Convention: {
                connect: {
                  id: req.body._token.conventionId,
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
      passToken,
      errorWrapper(
        async (
          req: Request<AccountDeleteBody, Query, Params>,
          res: Response
        ) => {
          /*
           * 1. Confirm token is valid
           * 2. Retrieve user - (confirm exists)
           * 3. Compare permission levels
           * 4. Delete if higher & allowed to delete
           */
          paramValid(req.body.token, 1, 48, "token");
          if (roleEnumToNum(req.body._token.role) == roleEnumToNum(Role.MOD))
            throw new BadRequest("Invalid request!");
          const attacked = await this.prisma.account.findUnique({
            where: {
              token: req.body.token,
            },
            select: {
              id: true,
              role: true,
            },
          });
          if (
            attacked == null ||
            roleEnumToNum(req.body._token.role) <= roleEnumToNum(attacked.role)
          ) {
            // Explicity give vague warning to avoid enumeration
            throw new BadRequest("Invalid request!");
          }
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
