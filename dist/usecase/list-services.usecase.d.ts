import { ServicesRepository } from "../repository/services.repository";
export declare class ListCompletedServicesUseCase {
    private repository;
    constructor(repository: ServicesRepository);
    execute(filter: {
        location: string[];
        range: {
            from: string;
            to: string;
        };
    }): Promise<any[]>;
    static validateDates(range: {
        from: Date;
        to: Date;
    }): boolean;
    static formatDate(date: Date): string;
    static mapTypeService(data: {
        origin: string;
        order_service: string;
        tss: string;
        start_date: string;
        finish_date: string;
        address: string;
        city: string;
        status: string;
        result: string;
        created_at: string;
    }): {
        start_date: string;
        finish_date: string;
        type: any;
        origin: string;
        order_service: string;
        tss: string;
        address: string;
        city: string;
        status: string;
        result: string;
        created_at: string;
    };
    static updateSummary(dataArray: any[]): any[];
}
