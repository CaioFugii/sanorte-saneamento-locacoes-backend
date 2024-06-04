import { NextFunction, Request, Response, Router } from "express";
import middlewares from "../middlewares";
import { LoginUseCase } from "../usecase/login.usecase";
import { ListServicesUseCase } from "../usecase/list-services.usecase";
import { RegisterServicesUseCase } from "../usecase/register-services.usecase";
import { ServicesRepository } from "../repository/services.repository";
import { connectionPool } from "../repository/database-connection";
import multer from "multer";
import path from "path";
import { send } from "process";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const folderPath =
      process.env.NODE_ENV !== "local"
        ? path.join(process.cwd(), "dist", "tmp")
        : path.join(process.cwd(), "src", "tmp");
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
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.file;
      const { location } = JSON.parse(req.headers.authorization);
      const repository = new ServicesRepository(connectionPool);
      const usecase = new RegisterServicesUseCase(repository);
      await usecase.execute(path, location);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
