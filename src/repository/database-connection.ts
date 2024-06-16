import { Pool } from "pg";

export const connectionPool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  port: 5432,
  database: process.env.DB_NAME,
});

connectionPool.on("connect", () => {
  console.log("Base de Dados conectado com sucesso!");
});

connectionPool.on("error", (err, _) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
