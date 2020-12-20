import { Router, Response } from "express";
import { Pool } from "pg";

import pin from "./helpers/pin";

import { Request, Query, Params } from "../types/post";
import { AccountDeleteBody, AccountPostBody } from "../types/account";

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
    return this.router;
  }
}

export default Account;
