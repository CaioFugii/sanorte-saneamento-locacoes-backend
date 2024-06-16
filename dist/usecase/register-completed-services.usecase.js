"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCompletedServicesUseCase = void 0;
const fs_1 = require("fs");
const xlsx_1 = require("xlsx");
const http_error_1 = require("../shared/http-error");
const date_fns_1 = require("date-fns");
class RegisterCompletedServicesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(pathFile, origin) {
        try {
            if (origin === "*") {
                throw new http_error_1.HttpError("Invalid Origin of file", 400);
            }
            const workbook = (0, xlsx_1.readFile)(pathFile);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx_1.utils.sheet_to_json(worksheet);
            const isValid = RegisterCompletedServicesUseCase.checkHeaders(jsonData[0]);
            if (!isValid) {
                throw new http_error_1.HttpError("Invalid Headers on file", 400);
            }
            const dataToSave = jsonData.map((data) => {
                return {
                    origin,
                    order_service: data["Número OS"].trim(),
                    tss: data["Descrição TSS"].trim(),
                    start_date: RegisterCompletedServicesUseCase.getDate(data["Data Início Execução"].trim()),
                    finish_date: RegisterCompletedServicesUseCase.getDate(data["Data Fim Execução"].trim()),
                    address: `${data["Endereço"]}, número: ${data["Número"] ?? "S/N"} - ${data["Complemento"]}, Bairro: ${data["Bairro"]}`.trim(),
                    city: data["Município"].trim(),
                    status: data["Status da OS"].trim(),
                    result: data["Resultado"].trim(),
                    created_at: new Date(),
                };
            });
            await this.repository.insertCompletedServices(dataToSave);
            const now = new Date();
            const oneMonthAgo = (0, date_fns_1.sub)(now, { days: 32 }).toISOString();
            await this.repository.deleteItems(oneMonthAgo);
        }
        catch (error) {
            throw error;
        }
        finally {
            if ((0, fs_1.existsSync)(pathFile)) {
                (0, fs_1.unlinkSync)(pathFile);
            }
        }
    }
    static getDate(dateString) {
        const [date, time] = dateString.split(" ");
        const [hour, minute] = time.split(":").map(Number);
        const [day, month, year] = date.split("/").map(Number);
        const monthNumber = month - 1;
        return new Date(year, monthNumber, day, hour, minute);
    }
    static checkHeaders(data) {
        return (data.hasOwnProperty("Número OS") &&
            data.hasOwnProperty("Descrição TSS") &&
            data.hasOwnProperty("Data Início Execução") &&
            data.hasOwnProperty("Data Fim Execução") &&
            data.hasOwnProperty("Endereço") &&
            data.hasOwnProperty("Município") &&
            data.hasOwnProperty("Status da OS") &&
            data.hasOwnProperty("Resultado"));
    }
}
exports.RegisterCompletedServicesUseCase = RegisterCompletedServicesUseCase;
//# sourceMappingURL=register-completed-services.usecase.js.map