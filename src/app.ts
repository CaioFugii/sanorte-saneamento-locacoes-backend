import express, { Request, Response } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import middlewares from "./middlewares";
import router from "./routers";

const app = express();

config();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "50mb" }));

app.get(
  "/",
  middlewares.limiter,
  middlewares.speedLimiter,
  // middlewares.authToken,
  (_: Request, res: Response) => {
    res.status(200).json({
      message: "🤯",
    });
  }
);

app.use("/api/", cors(), router);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
