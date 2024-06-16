import { existsSync, mkdirSync } from "fs";
import app from "./app";
import { connectionPool } from "./repository/database-connection";
import path from "path";
import { startRoutine } from "./cron-routine/cron-job";

const PORT = Number(process.env.PORT);

const bootstrap = async () => {
  try {
    await connectionPool.connect();

    startRoutine();

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize the database connection", err);
    process.exit(1);
  }
};

bootstrap();
