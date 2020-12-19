import { Router, Response } from "express";
import { Pool } from "pg";

import pin from "./helpers/pin";

import { Request, Query, Params } from "../types/post";
import { RoomPostBody } from "../types/room";

class Room {
  router: Router;
  pool: Pool;
  constructor(pool: Pool) {
    this.router = Router();
    this.pool = pool;
  }

  setup(): Router {
    this.router.get("", (req: Request, res: Response) => {
      return res.status(200).send();
    });
    this.router.post(
      "",
      (req: Request<RoomPostBody, Query, Params>, res: Response) => {
        if (
          !req.body.name ||
          req.body.name.length > 48 ||
          req.body.name.length < 1
        )
          return res.status(400).json({
            error: "Missing 'name', which must be between 1 and 48 characters",
          });
        this.pool
          .query(
            "INSERT INTO ROOM(NAME, CONVENTION, ACCESS_CODE) VALUES($1, $2, $3) RETURNING id;",
            [req.body.name, "Unimplemented", pin(7)]
          )
          .then((result) => res.status(200).json({ result: result }))
          .catch((err) => res.status(500).json({ error: err }));
      }
    );
    this.router.patch("conclude", (req: Request, res: Response) => {});
    this.router.patch("byline", (req: Request, res: Response) => {});
    this.router.patch("toggle", (req: Request, res: Response) => {});
    this.router.delete("", (req: Request, res: Response) => {});
    this.router.delete("all", (req: Request, res: Response) => {});
    return this.router;
  }
}

export default Room;
