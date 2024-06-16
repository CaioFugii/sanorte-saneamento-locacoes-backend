import { NextFunction, Request, Response, Router } from "express";
import middlewares from "../middlewares";
import { LoginUseCase } from "../usecase/login.usecase";
import { ListCompletedServicesUseCase } from "../usecase/list-services.usecase";
import { RegisterCompletedServicesUseCase } from "../usecase/register-completed-services.usecase";
import { ServicesRepository } from "../repository/services.repository";
import { connectionPool } from "../repository/database-connection";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const folderPath = "/tmp";
    cb(null, folderPath);
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
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
  limits: { fileSize: 10 * 1024 * 1024 },
});
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { location, role } = JSON.parse(req.headers.authorization);

      const rangeFrom = (req.query?.from as string) || "";
      const rangeTo = (req.query?.to as string) || "";
      const queryLocation =
        (req.query?.location as string) || "Santos - Cubatão";

      // available locations:
      //  "Santos - Cubatão"
      // "São Sebastião - Ilha bela"
      // "São Vicente"

      let filterLocation = null;
      if (role === "admin" && location === "*") {
        filterLocation = [queryLocation];
      } else {
        filterLocation = [location];
      }
      const repository = new ServicesRepository(connectionPool);
      const usecase = new ListCompletedServicesUseCase(repository);
      const response = await usecase.execute({
        location: filterLocation,
        range: { from: rangeFrom, to: rangeTo },
      });

      return res.status(200).json(response ?? []);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/services",
  middlewares.authToken,
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.file;
      const { location } = JSON.parse(req.headers.authorization);
      const repository = new ServicesRepository(connectionPool);
      const usecase = new RegisterCompletedServicesUseCase(repository);
      await usecase.execute(path, location);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
