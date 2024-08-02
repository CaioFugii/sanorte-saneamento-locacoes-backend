import { unlinkSync, existsSync } from "fs";
import { ServicesRepository } from "../repository/services.repository";
import { readFile, utils } from "xlsx";
import { HttpError } from "../shared/http-error";
import { sub } from "date-fns";
export class RegisterPendingServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(pathFile: string, origin: string, role: string): Promise<void> {
    try {
      const workbook = readFile(pathFile);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      if (!jsonData[0]) {
        throw new HttpError("Invalid File", 400);
      }

      const isValid = RegisterPendingServicesUseCase.checkHeaders(jsonData[0]);

      if (!isValid) {
        throw new HttpError("Invalid Headers on file", 400);
      }

      const created_at = new Date();
      const dataToSave = jsonData.map((data) => {
        return {
          origin,
          order_service: data["Número OS"].trim(),
          tss: data["TSS"].trim(),
          start_date: RegisterPendingServicesUseCase.getDate(
            data["Data de Competência"].trim()
          ),
          address: `${data["Endereço"]}, número: ${data["Número"] ?? "S/N"} - ${
            data["Complemento"]
          }, Bairro: ${data["Bairro"]}`.trim(),
          city: data["Município"].trim(),
          status: data["Status da OS"].trim(),
          created_at,
        };
      });

      await this.repository.insertPendingServices(dataToSave);

      const now = new Date();
      const oneMonthAgo = sub(now, { days: 32 }).toISOString();

      await this.repository.deleteItems(oneMonthAgo);
    } catch (error) {
      console.error(error);
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
      data.hasOwnProperty("TSS") &&
      data.hasOwnProperty("Data de Competência") &&
      data.hasOwnProperty("Endereço") &&
      data.hasOwnProperty("Município") &&
      data.hasOwnProperty("Status da OS")
    );
  }
}
