import express, { Request, Response } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import middlewares from "./middlewares";
import router from "./routers";

const app = express();

config();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Forwarded-For"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

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

app.use("/api/", router);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
