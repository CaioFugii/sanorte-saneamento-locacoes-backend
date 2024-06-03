import app from "./app";
import {
  closeConnectionPool,
  initializeConnectionPool,
} from "./repository/database-connection";

const PORT = Number(process.env.PORT);

const bootstrap = async () => {
  try {
    // await initializeConnectionPool();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize the database connection", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  closeConnectionPool().then(() => process.exit(0));
});

process.on("SIGINT", () => {
  closeConnectionPool().then(() => process.exit(0));
});

bootstrap();
