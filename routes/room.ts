import { Router, Response } from "express";
import { Pool } from "pg";

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
      return res.status(200);
    });
    this.router.post(
      "",
      (req: Request<RoomPostBody, Query, Params>, res: Response) => {
        return res.status(501).json({ error: "Not implemented" });
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
