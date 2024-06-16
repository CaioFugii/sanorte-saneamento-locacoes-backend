"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRepository = void 0;
class ServicesRepository {
    constructor(databaseConnection) {
        this.databaseConnection = databaseConnection;
        this.databaseConnection = databaseConnection;
    }
    async find(filter) {
        try {
            const location = filter.location
                .map((location) => `'${location}'`)
                .join(", ");
            const query = `SELECT * FROM completed_services WHERE origin IN (${location}) AND finish_date >= '${filter.range.from}' AND finish_date <= '${filter.range.to}' ORDER BY finish_date DESC`;
            console.log(query);
            const result = await this.databaseConnection.query(query);
            return result.rows ?? [];
        }
        catch (error) {
            throw error;
        }
    }
    async insertCompletedServices(payload) {
        try {
            for (const item of payload) {
                const query = `
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
                await this.databaseConnection.query(query, values);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async deleteItems(date) {
        try {
            const query = `delete from completed_services where finish_date <= '${date}'`;
            console.log(query);
            await this.databaseConnection.query(query);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ServicesRepository = ServicesRepository;
//# sourceMappingURL=services.repository.js.map