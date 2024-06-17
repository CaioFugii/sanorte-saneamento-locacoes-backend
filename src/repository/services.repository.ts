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
export class ServicesRepository {
  constructor(public databaseConnection: Client) {
    this.databaseConnection = databaseConnection;
  }
  async find(filter: {
    location: string[];
    range: { from: string; to: string };
  }) {
    try {
      const location = filter.location
        .map((location) => `'${location}'`)
        .join(", ");
      const query = `SELECT * FROM completed_services WHERE origin IN (${location}) AND finish_date >= '${filter.range.from}' AND finish_date <= '${filter.range.to}' ORDER BY finish_date DESC`;
      console.log(query);
      const result = await this.databaseConnection.query(query);
      return result.rows ?? [];
    } catch (error) {
      throw error;
    }
  }

  async insertCompletedServices(payload: InsertCompletedPayload[]) {
    try {
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

        const selectQuery = `SELECT order_service FROM pending_services WHERE order_service = ${item.order_service}`;
        const found = await this.databaseConnection.query(selectQuery);

        if (found.rows.length > 0) {
          const deleteQuery = `DELETE FROM pending_services WHERE order_service = ${item.order_service}`;
          await this.databaseConnection.query(deleteQuery);
        } else {
          continue;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async insertPendingServices(payload: InsertPendingPayload[]) {
    try {
      for (const item of payload) {
        const selectQuery = `SELECT order_service FROM completed_services WHERE order_service = ${item.order_service}`;
        const found = await this.databaseConnection.query(selectQuery);

        if (found.rows.length > 0) {
          continue;
        } else {
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
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteItems(date: string) {
    try {
      const completedQuery = `delete from completed_services where finish_date <= '${date}'`;
      console.log(completedQuery);
      await this.databaseConnection.query(completedQuery);

      const pendingQuery = `delete from pending_services where start_date <= '${date}'`;
      console.log(pendingQuery);
      await this.databaseConnection.query(pendingQuery);
    } catch (error) {
      throw error;
    }
  }
}
