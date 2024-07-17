import { Client } from "pg";

type InsertCompletedPayload = {
  origin: string;
  order_service: string;
  tss: string;
  start_date: Date;
  finish_date: Date;
  address: string;
  city: string;
  status: string;
  result: string;
  created_at: Date;
};

type InsertPendingPayload = {
  origin: string;
  order_service: string;
  tss: string;
  start_date: Date;
  address: string;
  city: string;
  status: string;
  created_at: Date;
};
const lastInserts: { location: string; date?: string; type: string }[] = [];
export class ServicesRepository {
  constructor(public databaseConnection: Client) {
    this.databaseConnection = databaseConnection;
  }
  async findCompletedServices(filter: { location: string }) {
    try {
      const location = filter.location;
      const query = `SELECT * FROM completed_services WHERE origin = '${location}' ORDER BY finish_date DESC`;
      console.log(query);
      const result = await this.databaseConnection.query(query);
      return result.rows ?? [];
    } catch (error) {
      throw error;
    }
  }

  async findPendingServices(filter: { location: string }) {
    try {
      const location = filter.location;
      const query = `SELECT * FROM pending_services WHERE origin = '${location}' ORDER BY start_date DESC`;
      console.log(query);
      const result = await this.databaseConnection.query(query);
      return result.rows ?? [];
    } catch (error) {
      throw error;
    }
  }

  async insertCompletedServices(payload: InsertCompletedPayload[]) {
    try {
      const firstItem = payload[0];
      const deleteQuery = `delete from completed_services where origin = '${firstItem.origin}'`;
      console.log("DELETE COMPLETED: ", deleteQuery);
      await this.databaseConnection.query(deleteQuery);

      for (const item of payload) {
        const insertQuery = `
          INSERT INTO completed_services (origin, order_service, tss, start_date, finish_date, address, city, status, result, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING
        `;
        const values = [
          item.origin,
          item.order_service,
          item.tss,
          item.start_date,
          item.finish_date,
          item.address,
          item.city,
          item.status,
          item.result,
          item.created_at,
        ];
        await this.databaseConnection.query(insertQuery, values);
      }

      if (
        !lastInserts.some(
          (element) =>
            element?.location === firstItem.origin &&
            element?.type === "completed"
        )
      ) {
        lastInserts.push({
          location: firstItem.origin,
          date: new Date().toISOString(),
          type: "completed",
        });
      } else {
        const index = lastInserts.findIndex(
          (value) =>
            value.location === firstItem.origin && value.type === "completed"
        );
        lastInserts.splice(index, 1, {
          location: firstItem.origin,
          date: new Date().toISOString(),
          type: "completed",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async insertPendingServices(payload: InsertPendingPayload[]) {
    try {
      const firstItem = payload[0];
      const pendingQuery = `delete from pending_services where origin = '${firstItem.origin}'`;
      console.log("DELETE PENDING: ", pendingQuery);
      await this.databaseConnection.query(pendingQuery);
      for (const item of payload) {
        const insertQuery = `
            INSERT INTO pending_services (origin, order_service, tss, start_date, address, city, status, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING
          `;
        const values = [
          item.origin,
          item.order_service,
          item.tss,
          item.start_date,
          item.address,
          item.city,
          item.status,
          item.created_at,
        ];
        await this.databaseConnection.query(insertQuery, values);
      }
      if (
        !lastInserts.some(
          (element) =>
            element?.location === firstItem.origin &&
            element?.type === "pending"
        )
      ) {
        lastInserts.push({
          location: firstItem.origin,
          date: new Date().toISOString(),
          type: "pending",
        });
      } else {
        const index = lastInserts.findIndex(
          (value) =>
            value.location === firstItem.origin && value.type === "pending"
        );
        lastInserts.splice(index, 1, {
          location: firstItem.origin,
          date: new Date().toISOString(),
          type: "pending",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteItems(date: string) {
    try {
      const completedQuery = `delete from completed_services where created_at <= '${date}'`;
      console.log("DELETE COMPLETED: ", completedQuery);
      await this.databaseConnection.query(completedQuery);

      const pendingQuery = `delete from pending_services where created_at <= '${date}'`;
      console.log("DELETE PENDING: ", pendingQuery);
      await this.databaseConnection.query(pendingQuery);
    } catch (error) {
      throw error;
    }
  }

  async getLastInserts(location: string) {
    const lastCompletedInsert = lastInserts.find(
      (e) => e.location === location && e.type === "completed"
    );
    const lastPendingInsert = lastInserts.find(
      (e) => e.location === location && e.type === "pending"
    );

    if (lastCompletedInsert && lastPendingInsert) {
      return [lastCompletedInsert, lastPendingInsert];
    }

    const getQuery = (type: string) =>
      `SELECT created_at FROM ${type}_services WHERE origin = '${location}' ORDER BY created_at DESC LIMIT 1`;

    const fetchInsert = async (type: string) => {
      const result = await this.databaseConnection.query(getQuery(type));
      return result.rows.length
        ? { location, date: result.rows[0].created_at, type }
        : { location, date: null, type };
    };

    const [completedResult, pendingResult] = await Promise.all([
      lastCompletedInsert
        ? Promise.resolve(lastCompletedInsert)
        : fetchInsert("completed"),
      lastPendingInsert
        ? Promise.resolve(lastPendingInsert)
        : fetchInsert("pending"),
    ]);

    return [completedResult, pendingResult];
  }
}
