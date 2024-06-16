import { ServicesRepository } from "../repository/services.repository";
export declare class RegisterCompletedServicesUseCase {
    private repository;
    constructor(repository: ServicesRepository);
    execute(pathFile: string, origin: string): Promise<void>;
    static getDate(dateString: string): Date;
    static checkHeaders(data: any): boolean;
}
