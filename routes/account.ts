import { Router, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

import auth from "./middleware/auth";

import pin from "./helpers/pin";

import { Request, Query, Params } from "../types/post";
import {
  AccountDeleteBody,
  AccountLoginBody,
  AccountPostBody,
} from "../types/account";

class Account {
  router: Router;
  pool: Pool;
  constructor(pool: Pool) {
    this.router = Router();
    this.pool = pool;
  }

  setup(): Router {
    this.router.post(
      "",
      auth(3),
      (req: Request<AccountPostBody, Query, Params>, res: Response) => {
        if (
          !req.body.token ||
          req.body.token.length > 48 ||
          req.body.token.length < 1
        )
          return res.status(400).json({
            error: "Missing 'token', which must be between 1 and 48 characters",
          });
        this.pool
          .query(
            "INSERT INTO ACCOUNT(TOKEN, CONVENTION, PIN, PERMISSIONS) VALUES ($1, $2, $3, $4) RETURNING TOKEN,PIN,PERMISSIONS",
            [req.body.token, "Unimplemented", pin(7), 0]
          )
          .then((result) => res.status(201).json({ result: result.rows }))
          .catch((err) => res.status(500).json({ error: err }));
      }
    );
    this.router.delete(
      "",
      (req: Request<AccountDeleteBody, Query, Params>, res: Response) => {
        if (
          !req.body.token ||
          req.body.token.length > 48 ||
          req.body.token.length < 1
        )
          return res.status(400).json({
            error: "Missing 'token', which must be between 1 and 48 characters",
          });
        this.pool
          .query("DELETE FROM ACCOUNT WHERE TOKEN=$1", [req.body.token])
          .then((result) => {
            if (result.rowCount == 0)
              return res.status(404).json({ error: "User not found" });
            return res.status(204).send();
          })
          .catch((err) => res.status(500).json({ error: err }));
      }
    );
    this.router.post(
      "/login",
      (req: Request<AccountLoginBody, Query, Params>, res: Response) => {
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
        this.pool
          .query("SELECT * FROM ACCOUNT WHERE TOKEN=$1 AND PIN=$2", [
            req.body.token,
            req.body.pin,
          ])
          .then((result) => {
            if (!result.rows[0]) {
              return res.status(400).json({ error: "Incorrect token/pin!" });
            }
            const token = jwt.sign(
              {
                token: result.rows[0].token,
                convention: result.rows[0].convention,
                permissions: result.rows[0].permissions,
              },
              process.env.SECRET,
              { expiresIn: "7d" }
            );
            return res.status(200).json({ token: token });
          })
          .catch((err) => res.status(500).json({ error: err }));
      }
    );
    return this.router;
  }
}

export default Account;
