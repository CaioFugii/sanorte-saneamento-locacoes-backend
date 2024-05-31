import { NextFunction, Request, Response } from "express";
import { HttpError } from "./shared/http-error";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { verifyToken } from "./shared/jwt";
import { BadRequestError } from "./shared/bad-request-error";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new HttpError(
    `🔍🧐 - Route Not Found - ${req.originalUrl}`,
    404
  );
  next(error);
};

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing 'Authorization' header. 🔐" });
  }

  const { decoded, valid } = verifyToken(auth);

  if (!valid) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token. 🔐" });
  }

  req.headers.authorization = JSON.stringify(decoded);

  next();
};

const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof BadRequestError) {
    const { errors, stack } = err as BadRequestError;
    return res.status(400).json({
      message: "Bad request error",
      errors,
      stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
    });
  }

  if (err instanceof HttpError) {
    const { code, message, stack } = err as HttpError;
    return res.status(code).json({
      message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
    });
  } else {
    const { stack } = err;
    return res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
    });
  }
};

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 5,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: (hits) => hits * 100,
});

export default {
  notFound,
  authToken,
  errorHandler,
  limiter,
  speedLimiter,
};
