import { Client } from "pg";

export const connectionPool = new Client({
  connectionString:
    process.env.DATABASE_URL ??
    "postgres://ucvrlbs2cretlg:p885330c9cb6a0c3fbaa094cca37d72ac0ecc4ace15384ddba0f3248950687e1f@ccba8a0vn4fb2p.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9rvgaij88f60j",
  ssl: {
    rejectUnauthorized: false,
  },
});
