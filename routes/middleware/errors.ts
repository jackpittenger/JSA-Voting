import type { Request, Response, NextFunction } from "express";

export class GeneralError extends Error {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }

  getCode(): number {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof Unauthorized) {
      return 401;
    }

    if (this instanceof NotFound) {
      return 404;
    }
    return 500;
  }
}

export class Unauthorized extends GeneralError {}
export class BadRequest extends GeneralError {}
export class NotFound extends GeneralError {}

export function errorWrapper(fn: Function) {
  return function wrapped(
    req: Request,
    res: Response,
    next: NextFunction,
    ...args
  ) {
    const fnReturn = fn(req, res, next, ...args);
    return Promise.resolve(fnReturn).catch(next);
  };
}

export function errorWrapperSocket(fn: Function) {
  return function wrapped(data: {}, room: string) {
    const fnReturn = fn(data, room);
    return Promise.resolve(fnReturn).catch(() =>
      console.log("error in errorWrapperSocket")
    );
  };
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      error: err.message,
    });
  }

  console.error("ERROR in handler: " + err.stack);
  return res.status(500).json({
    error: err.message,
  });
}
