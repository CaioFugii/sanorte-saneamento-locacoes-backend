import { NextFunction, Request, Response, Router } from "express";
import { HttpError } from "../shared/http-error";
import middlewares from "../middlewares";
import { generateToken } from "../shared/jwt";
import { LoginSchemaValidator } from "./schema-validations/login-schema";
import { BadRequestError } from "../shared/bad-request-error";

const router = Router();

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const { valid, errors } = LoginSchemaValidator.validate(body);

    if (!valid) {
      throw new BadRequestError(errors);
    }

    const location = req.body.location;

    const allowedLocations = ["sv"];

    if (!allowedLocations.includes(location)) {
      throw new HttpError("Invalid location", 400);
    }

    const response = {
      token: generateToken({
        location: req.body.location,
        role: req.body.role,
      }),
    };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/services",
  middlewares.authToken,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.headers.authorization);
      const response = {
        message: "😀🤠🤯🧐",
      };
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
