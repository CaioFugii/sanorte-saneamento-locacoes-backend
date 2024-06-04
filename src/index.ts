import app from "./app";
import { connectionPool } from "./repository/database-connection";

const PORT = Number(process.env.PORT);

const bootstrap = async () => {
  try {
    await connectionPool.connect();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize the database connection", err);
    process.exit(1);
  }
};

bootstrap();
