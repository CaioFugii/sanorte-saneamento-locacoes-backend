import { Client } from "pg";

export const connectionPool = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
