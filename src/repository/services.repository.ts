import { Pool } from "pg";

export class ServicesRepository {
  constructor(public pool: Pool) {
    this.pool = pool;
  }
  async find(payload: any) {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }

  async insert(payload: any) {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
