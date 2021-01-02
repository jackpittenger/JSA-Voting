import { verify } from "jsonwebtoken";

import { Role } from "../../types/enums";

import type { Request, Response, NextFunction } from "express";
import type { Token } from "../../types/jwt";

export default function (role: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
      return res.status(401).json({ error: "No authorization header" });
    verify(
      req.header("Authorization"),
      process.env.SECRET,
      (err: Error, decoded: Token) => {
        if (err) {
          return res.status(401).json({ error: "JWT not verified" });
        }
        const drole: Role = (<any>Role)[decoded.role];
        if (role > drole) {
          return res
            .status(401)
            .json({ error: "You don't have high enough permissions!" });
        }
        return next();
      }
    );
  };
}
