import { existsSync, mkdirSync } from "fs";
import app from "./app";
import { connectionPool } from "./repository/database-connection";
import path from "path";

const PORT = Number(process.env.PORT);

const bootstrap = async () => {
  try {
    await connectionPool.connect();
    if (!existsSync(path.join(__dirname, "tmp"))) {
      mkdirSync(path.join(__dirname, "tmp"));
    }

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize the database connection", err);
    process.exit(1);
  }
};

bootstrap();
