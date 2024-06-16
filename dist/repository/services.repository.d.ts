import { Pool } from "pg";
type InsertPayload = {
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
export declare class ServicesRepository {
    databaseConnection: Pool;
    constructor(databaseConnection: Pool);
    find(filter: {
        location: string[];
        range: {
            from: string;
            to: string;
        };
    }): Promise<any[]>;
    insertCompletedServices(payload: InsertPayload[]): Promise<void>;
    deleteItems(date: string): Promise<void>;
}
export {};
