import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = {
      message: "Success login",
    };
    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/services", (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = {
      message: "😀🤠🤯🧐",
    };
    return res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
