import { verify } from "jsonwebtoken";

import { Unauthorized } from "./errors";

import { roleEnumToNum } from "../helpers/enumToNum";

import { Role } from "@prisma/client";

import type { Request, Response, NextFunction } from "express";
import type { Token } from "../../types/jwt";
import type { PrismaClient } from "@prisma/client";

export function roleVerify(role: Role) {
  return function (req: Request, _res: Response, next: NextFunction) {
    //@ts-ignore
    const decoded: Token = getToken(req);
    const drole: Role = (<any>Role)[decoded.role];
    if (roleEnumToNum(role) > roleEnumToNum(drole))
      throw new Unauthorized("You don't have high enough permissions!");
    return next();
  };
}

export function passToken(req: Request, _res: Response, next: NextFunction) {
  req.body._token = getToken(req);
  next();
}

export async function verifyRoomIO(
  token: Token,
  room: string,
  prisma: PrismaClient
) {
  try {
    const r = await prisma.room.findUnique({
      where: {
        id: parseInt(room),
      },
      select: {
        id: true,
        conventionId: true,
        concluded: true,
      },
    });
    // Return false if the room doesn't exist
    if (r == null || !r) return false;
    // Return false if the room is concluded
    if (r.concluded) return false;
    // Return true if the account is the same convention and has the role
    if (
      token.conventionId === r.conventionId &&
      roleEnumToNum(token.role) >= roleEnumToNum(Role.MOD)
    )
      return true;
    // Return true if the account is DEV
    if (token.role === Role.DEV) return true;
    return false;
  } catch {
    return false;
  }
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
