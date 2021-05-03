import { BadRequest, errorWrapper } from "./errors";
import conventionAccess from "../helpers/conventionAccess";

import type { ConventionRoomBody } from "../../types/room";
import type { Request, Response, NextFunction } from "express";
import type { Query, Params } from "../../types/post";
import type { PrismaClient } from "@prisma/client";

export default function passConventionRoom(prisma: PrismaClient, select: {}) {
  return errorWrapper(async function wrapped(
    req: Request<ConventionRoomBody, Query, Params>,
    _res: Response,
    next: NextFunction
  ) {
    //@ts-ignore
    req.body._id = parseInt(req.body.id);
    const room = await prisma.room.findUnique({
      where: {
        //@ts-ignore
        id: req.body._id,
      },
      select: select,
    });
    if (!room) throw new BadRequest("Invalid room!");
    //@ts-ignore
    conventionAccess(req.body._token, room.conventionId);
    //@ts-ignore
    req.body.room = room;
    next();
  });
}
