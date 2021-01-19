import { verify } from "jsonwebtoken";

import { Unauthorized } from "./errors";

import { Role } from "../../types/enums";

import type { Request, Response, NextFunction } from "express";
import type { Token } from "../../types/jwt";

export function roleVerify(role: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const decoded: Token = getToken(req);
    const drole: Role = (<any>Role)[decoded.role];
    if (role > drole)
      throw new Unauthorized("You don't have high enough permissions!");
    return next();
  };
}

export function passToken(req: Request, _res: Response, next: NextFunction) {
  //@ts-ignore
  req.token = getToken(req);
  next();
}

function getToken(req: Request) {
  if (!req.headers.authorization)
    throw new Unauthorized("No authorization header");
  try {
    return verify(req.header("Authorization"), process.env.SECRET);
  } catch (err) {
    throw new Unauthorized("JWT not verified");
  }
}
