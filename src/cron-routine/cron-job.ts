import { connectionPool } from "../repository/database-connection";
import { sub } from "date-fns";
import { ServicesRepository } from "../repository/services.repository";

const cron = require("node-cron");

export const startRoutine = () => {
  cron.schedule("0 12 * * 1", async () => {
    try {
      console.log("startRoutine");
      const now = new Date();
      const oneMonthAgo = sub(now, { days: 32 }).toISOString();

      const repository = new ServicesRepository(connectionPool);

      await repository.deleteItems(oneMonthAgo);
    } catch (error) {
      console.error(error);
    }
  });
};
