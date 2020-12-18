import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization)
    return res.status(401).json({ error: "No authorization header" });
  verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err: Error, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      }
      return next();
    }
  );
}
