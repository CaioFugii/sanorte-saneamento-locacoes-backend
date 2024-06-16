import { unlinkSync, existsSync } from "fs";
import { ServicesRepository } from "../repository/services.repository";
import { readFile, utils } from "xlsx";
import { HttpError } from "../shared/http-error";
import { sub } from "date-fns";
export class RegisterCompletedServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(pathFile: string, origin: string): Promise<void> {
    try {
      if (origin === "*") {
        throw new HttpError("Invalid Origin of file", 400);
      }

      const workbook = readFile(pathFile);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      const isValid = RegisterCompletedServicesUseCase.checkHeaders(
        jsonData[0]
      );

      if (!isValid) {
        throw new HttpError("Invalid Headers on file", 400);
      }

      const dataToSave = jsonData.map((data) => {
        return {
          origin,
          order_service: data["Número OS"].trim(),
          tss: data["Descrição TSS"].trim(),
          start_date: RegisterCompletedServicesUseCase.getDate(
            data["Data Início Execução"].trim()
          ),
          finish_date: RegisterCompletedServicesUseCase.getDate(
            data["Data Fim Execução"].trim()
          ),
          address: `${data["Endereço"]}, número: ${data["Número"] ?? "S/N"} - ${
            data["Complemento"]
          }, Bairro: ${data["Bairro"]}`.trim(),
          city: data["Município"].trim(),
          status: data["Status da OS"].trim(),
          result: data["Resultado"].trim(),
          created_at: new Date(),
        };
      });

      await this.repository.insertCompletedServices(dataToSave);

      const now = new Date();
      const oneMonthAgo = sub(now, { days: 32 }).toISOString();

      await this.repository.deleteItems(oneMonthAgo);
    } catch (error) {
      throw error;
    } finally {
      if (existsSync(pathFile)) {
        unlinkSync(pathFile);
      }
    }
  }

  static getDate(dateString: string): Date {
    const [date, time] = dateString.split(" ");
    const [hour, minute] = time.split(":").map(Number);
    const [day, month, year] = date.split("/").map(Number);
    const monthNumber = month - 1;

    return new Date(year, monthNumber, day, hour, minute);
  }

  static checkHeaders(data: any): boolean {
    return (
      data.hasOwnProperty("Número OS") &&
      data.hasOwnProperty("Descrição TSS") &&
      data.hasOwnProperty("Data Início Execução") &&
      data.hasOwnProperty("Data Fim Execução") &&
      data.hasOwnProperty("Endereço") &&
      data.hasOwnProperty("Município") &&
      data.hasOwnProperty("Status da OS") &&
      data.hasOwnProperty("Resultado")
    );
  }
}
