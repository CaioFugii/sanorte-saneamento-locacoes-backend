import { NextFunction, Request, Response, Router } from "express";
import middlewares from "../middlewares";
import { LoginUseCase } from "../usecase/login.usecase";
import { ListServicesUseCase } from "../usecase/list-services.usecase";
import { RegisterServicesUseCase } from "../usecase/register-services.usecase";
import { ServicesRepository } from "../repository/services.repository";
import { connectionPool } from "../repository/database-connection";

const router = Router();

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    const usecase = new LoginUseCase();
    const response = usecase.execute({
      user: req.body.user,
      password: req.body.password,
    });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/services",
  middlewares.authToken,
  (_: Request, res: Response, next: NextFunction) => {
    try {
      const repository = new ServicesRepository(connectionPool);
      const usecase = new ListServicesUseCase(repository);
      const response = usecase.execute({});

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/services",
  middlewares.authToken,
  (_: Request, res: Response, next: NextFunction) => {
    try {
      const repository = new ServicesRepository(connectionPool);
      const usecase = new RegisterServicesUseCase(repository);
      const response = usecase.execute({});
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
