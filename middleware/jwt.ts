import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function (permissions: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
      return res.status(401).json({ error: "No authorization header" });
    verify(
      req.header("Authorization"),
      process.env.SECRET,
      (err: Error, decoded) => {
        if (err) {
          return res.status(401).json({ error: "JWT not verified" });
        }
        //Going to implement more verbose system later
        //@ts-ignore
        if (decoded.permissions < permissions) {
          return res
            .status(401)
            .json({ error: "You don't have high enough permissions!" });
        }
        return next();
      }
    );
  };
}
