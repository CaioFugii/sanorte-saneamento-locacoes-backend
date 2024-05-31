import { Pool } from "pg";

export const connectionPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: Number(process.env.DB_MAX_CONNECTIONS) || 10,
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT) || 2000,
});

connectionPool.on("error", (err, _) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const initializeConnectionPool = async () => {
  try {
    await connectionPool.query("SELECT NOW()");
    console.log("Database connection established");
  } catch (err) {
    console.error("Error connecting to the database", err);
    throw err;
  }
};

export const closeConnectionPool = async () => {
  try {
    await connectionPool.end();
    console.log("Pool has ended");
  } catch (err) {
    console.error("Error closing the pool", err);
  }
};
