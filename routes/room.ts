import { Router, Response } from "express";

import { passToken, roleVerify } from "./middleware/auth";
import { BadRequest, errorWrapper } from "./middleware/errors";
import passConventionRoom from "./middleware/passConventionRoom";

import conventionAccess from "./helpers/conventionAccess";
import { paramValid } from "./helpers/paramValid";
import pin from "./helpers/pin";

import { Role } from "@prisma/client";

import type { PrismaClient } from "@prisma/client";
import type { Request, Query, Params } from "../types/post";
import type {
  RoomBylineUpdate,
  RoomGetBody,
  RoomGetParams,
  RoomListBody,
  RoomListParams,
  RoomIdBody,
  RoomPostBody,
  RoomSpeakerPostBody,
  RoomSpeakerDeleteBody,
} from "../types/room";
import type { VoterToken } from "../types/voter";
import type SocketHandler from "./middleware/socketHandler";

export default class Room {
  router: Router;
  prisma: PrismaClient;
  socketHandler: SocketHandler;

  constructor(prisma: PrismaClient, socketHandler: SocketHandler) {
    this.router = Router();
    this.prisma = prisma;
    this.socketHandler = socketHandler;
  }

  setup(): Router {
    this.router.get(
      "/id/:id",
      roleVerify(Role.MOD),
      passToken,
      errorWrapper(
        async (
          req: Request<RoomGetBody, Query, RoomGetParams>,
          res: Response
        ) => {
          paramValid(req.params.id, 1, 30, "id");
          const room = await this.prisma.room.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            select: {
              id: true,
              name: true,
              accessCode: true,
              open: true,
              votingOpen: true,
              byline: true,
              speakers: true,
              Voter: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  school: true,
                  vote: true,
                  speaker: true,
                },
              },
              conventionId: true,
            },
          });
          conventionAccess(req.body._token, room.conventionId);
          if (room === null) throw new BadRequest("Invalid ID!");
          return res.status(200).json(room);
        }
      )
    );
    this.router.get(
      "/list/:convention/:per/:page",
      roleVerify(Role.MOD),
      passToken,
      errorWrapper(
        async (
          req: Request<RoomListBody, Query, RoomListParams>,
          res: Response
        ) => {
          paramValid(req.params.per, 1, 50, "per");
          paramValid(req.params.convention, 1, 1000000, "convention");
          paramValid(req.params.page, 1, 10000, "page");

          const per = parseInt(req.params.per);
          const convention = parseInt(req.params.convention);
          const page = parseInt(req.params.page);
          if (per < 0 || per > 50)
            throw new BadRequest("Improper number of per!");
          if (
            req.body._token.role !== Role.DEV &&
            req.body._token.conventionId !== convention
          )
            throw new BadRequest("Improper convention access!");

          const whereQuery = {
            Convention: {
              id: convention,
            },
          };
          if (
            typeof req.query.search == "string" &&
            req.query.search.length > 0
          ) {
            paramValid(req.query.search, 0, 150, "search");
            whereQuery["OR"] = [
              { name: { startsWith: req.query.search } },
              { accessCode: { startsWith: req.query.search } },
            ];
          }
          const count = await this.prisma.room.count({ where: whereQuery });
          const rooms = await this.prisma.room.findMany({
            where: whereQuery,
            select: {
              id: true,
              name: true,
              accessCode: true,
              concluded: true,
            },
            take: per,
            skip: per * page,
          });
          return res.status(200).json({ rooms: rooms, count: count });
        }
      )
    );
    this.router.post(
      "",
      roleVerify(Role.MOD),
      passToken,
      errorWrapper(
        async (req: Request<RoomPostBody, Query, Params>, res: Response) => {
          paramValid(req.body.name, 1, 48, "name");
          const room = await this.prisma.room.create({
            data: {
              name: req.body.name,
              accessCode: pin(7),
              Convention: {
                connect: {
                  id: 1,
                },
              },
              Creator: {
                connect: {
                  token: req.body._token.token,
                },
              },
            },
          });
          return res.status(201).json({ result: room });
        }
      )
    );
    this.router.get(
      "/speakers",
      passToken,
      errorWrapper(async (req: Request, res: Response) => {
        const token: VoterToken = req.body._token;
        const room = await this.prisma.room.findUnique({
          where: {
            accessCode: token.room.accessCode,
          },
          select: {
            id: true,
            speakers: true,
          },
        });
        if (!room.id) return res.status(400).json({ error: "Room not found!" });
        return res.status(200).json({ speakers: room.speakers });
      })
    );
    this.router.patch(
      "/conclude",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, { conventionId: true, concluded: true }),
      errorWrapper(
        async (req: Request<RoomIdBody, Query, Params>, res: Response) => {
          if (req.body.room.concluded)
            throw new BadRequest("Room is already concluded!");
          await this.prisma.room.update({
            where: {
              id: req.body._id,
            },
            data: {
              concluded: true,
            },
          });
          return res.status(200).json({ success: true });
        }
      )
    );
    this.router.patch(
      "/byline",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, {
        conventionId: true,
        concluded: true,
        byline: true,
      }),
      errorWrapper(
        async (
          req: Request<RoomBylineUpdate, Query, Params>,
          res: Response
        ) => {
          paramValid(req.body.byline, 1, 120, "byline");
          if (req.body.room.concluded)
            throw new BadRequest("Room is already concluded!");
          await this.prisma.room.update({
            where: {
              id: req.body._id,
            },
            data: {
              byline: req.body.byline,
            },
          });
          this.socketHandler.sendBylineUpdate(
            { byline: req.body.byline },
            req.body._id
          );
          res.status(200).json({ success: true });
        }
      )
    );
    this.router.post(
      "/speaker",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, {
        conventionId: true,
        concluded: true,
        speakers: true,
      }),
      errorWrapper(
        async (
          req: Request<RoomSpeakerPostBody, Query, Params>,
          res: Response
        ) => {
          if (req.body.room.concluded)
            throw new BadRequest("Room is already concluded!");
          if (
            req.body.room.speakers.findIndex(
              (item) => req.body.name.toLowerCase() === item.toLowerCase()
            ) !== -1
          )
            throw new BadRequest("Speaker already added!");
          await this.prisma.room.update({
            where: { id: req.body._id },
            data: { speakers: req.body.room.speakers.concat(req.body.name) },
          });
          return res.status(200).json({ success: true });
        }
      )
    );
    this.router.delete(
      "/speaker",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, {
        conventionId: true,
        concluded: true,
        speakers: true,
      }),
      errorWrapper(
        async (
          req: Request<RoomSpeakerDeleteBody, Query, Params>,
          res: Response
        ) => {
          if (req.body.room.concluded)
            throw new BadRequest("Room is already concluded!");
          const index = req.body.room.speakers.indexOf(req.body.name);
          if (index === -1) throw new BadRequest("Speaker doesn't exist!");
          req.body.room.speakers.splice(index, 1);
          await this.prisma.room.update({
            where: {
              id: req.body._id,
            },
            data: {
              speakers: req.body.room.speakers,
            },
          });
          return res.status(200).json({ success: true });
        }
      )
    );

    this.router.patch(
      "/toggle/open",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, { conventionId: true, open: true }),
      errorWrapper(
        async (req: Request<RoomIdBody, Query, Params>, res: Response) => {
          await this.prisma.room.update({
            where: {
              id: req.body._id,
            },
            data: {
              open: !req.body.room.open,
            },
          });
          return res.status(200).json({ success: true });
        }
      )
    );
    this.router.patch(
      "/toggle/voting",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, { conventionId: true, votingOpen: true }),
      errorWrapper(
        async (req: Request<RoomIdBody, Query, Params>, res: Response) => {
          await this.prisma.room.update({
            where: {
              id: req.body._id,
            },
            data: {
              votingOpen: !req.body.room.votingOpen,
            },
          });
          return res.status(200).json({ success: true });
        }
      )
    );
    this.router.delete(
      "",
      roleVerify(Role.MOD),
      passToken,
      passConventionRoom(this.prisma, { conventionId: true }),
      errorWrapper(
        async (req: Request<RoomIdBody, Query, Params>, res: Response) => {
          const deleteVoters = this.prisma.voter.deleteMany({
            where: {
              roomId: req.body._id,
            },
          });
          const deleteRoom = this.prisma.room.delete({
            where: {
              id: req.body._id,
            },
          });
          await this.prisma.$transaction([deleteVoters, deleteRoom]);
          res.status(200).json({ success: true });
        }
      )
    );
    this.router.delete("/all", (req: Request, res: Response) => {});
    return this.router;
  }
}
