import express, { Request, Response } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import middlewares from "./middlewares";
import { generateToken } from "./shared/jwt";
import router from "./routers";

const app = express();

if (process.env.NODE_ENV !== "production") {
  config();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get(
  "/",
  middlewares.limiter,
  middlewares.speedLimiter,
  middlewares.authToken,
  (_: Request, res: Response) => {
    res.json({
      message: "😀🤠🤯🧐",
    });
  }
);

app.use(middlewares.authToken);
app.use("/api/", router);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
