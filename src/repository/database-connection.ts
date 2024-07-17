import { Client } from "pg";

export const connectionPool = new Client({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://postgres:secret@localhost/postgres",
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
