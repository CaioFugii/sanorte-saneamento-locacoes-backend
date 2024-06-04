import { Pool } from "pg";

export const connectionPool = new Pool({
  connectionString: "postgres://postgres:secret@localhost:5432/postgres",
});

connectionPool.on("connect", () => {
  console.log("Base de Dados conectado com sucesso!");
});

connectionPool.on("error", (err, _) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
