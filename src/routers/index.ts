import { NextFunction, Request, Response, Router } from "express";
import middlewares from "../middlewares";
import { LoginUseCase } from "../usecase/login.usecase";
import { ListCompletedServicesUseCase } from "../usecase/list-completed-services.usecase";
import { ListPendingServicesUseCase } from "../usecase/list-pending-services.usecase";
import { RegisterPendingServicesUseCase } from "../usecase/register-pending-services.usecase";
import { RegisterCompletedServicesUseCase } from "../usecase/register-completed-services.usecase";
import { ListLastInsertsUseCase } from "../usecase/list-last-inserts.usecase";
import { ServicesRepository } from "../repository/services.repository";
import { connectionPool } from "../repository/database-connection";
import multer from "multer";
import path from "path";
import { HttpError } from "../shared/http-error";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const folderPath = "/tmp";
    cb(null, folderPath);
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(`FileName: ${file.originalname}`);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

const fileFilter = (
  _: any,
  file: { mimetype: string },
  cb: (arg0: Error, arg1: boolean) => void
) => {
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de arquivo não suportado. Por favor, envie um arquivo Excel."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});
const router = Router();

const availableLocations = {
  STS: "Santos",
  CBT: "Cubatão",
  SSB: "São Sebastião",
  ILB: "Ilha bela",
  SVT: "São Vicente",
  GUJ: "Guarujá",
  BTG: "Bertioga",
};

const validateLocation = (locations: string[], selectedLocation: string) => {
  if (!selectedLocation) {
    throw new HttpError("Location is required", 400);
  }

  const location = availableLocations[selectedLocation];

  if (!location) {
    throw new HttpError(`Location not found ${selectedLocation}!`, 404);
  }

  if (!locations.includes(location)) {
    throw new HttpError(
      `User not allowed to select this location: ${selectedLocation}`,
      403
    );
  }

  return location;
};

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
  "/completed-services",
  middlewares.authToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locations } = JSON.parse(req.headers.authorization);

      const queryLocation = req.query?.location as string;

      const location = validateLocation(locations, queryLocation);

      const repository = new ServicesRepository(connectionPool);
      const usecase = new ListCompletedServicesUseCase(repository);
      const response = await usecase.execute({
        location,
      });

      return res.status(200).json(response ?? []);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/pending-services",
  middlewares.authToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locations } = JSON.parse(req.headers.authorization);

      const queryLocation = req.query?.location as string;

      const location = validateLocation(locations, queryLocation);

      const repository = new ServicesRepository(connectionPool);
      const usecase = new ListPendingServicesUseCase(repository);
      const response = await usecase.execute({
        location,
      });

      return res.status(200).json(response ?? []);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/completed-services",
  middlewares.authToken,
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.file;
      const { locations, role } = JSON.parse(req.headers.authorization);

      const queryLocation = req.query?.location as string;
      const location = validateLocation(locations, queryLocation);
      console.log(`PAYLOAD Headers: ${location}, file: ${path}`);
      const repository = new ServicesRepository(connectionPool);
      const usecase = new RegisterCompletedServicesUseCase(repository);
      await usecase.execute(path, location, role);
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/pending-services",
  middlewares.authToken,
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.file;
      const { locations, role } = JSON.parse(req.headers.authorization);
      const queryLocation = req.query?.location as string;
      const location = validateLocation(locations, queryLocation);
      console.log(`PAYLOAD Headers: ${location}, file: ${path}`);
      const repository = new ServicesRepository(connectionPool);
      const usecase = new RegisterPendingServicesUseCase(repository);
      await usecase.execute(path, location, role);
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/last-inserts",
  middlewares.authToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locations } = JSON.parse(req.headers.authorization);
      const queryLocation = req.query?.location as string;
      const location = validateLocation(locations, queryLocation);

      console.log(location);

      const repository = new ServicesRepository(connectionPool);
      const usecase = new ListLastInsertsUseCase(repository);
      const response = await usecase.execute(location);

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
