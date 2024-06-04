import { unlinkSync, existsSync } from "fs";
import { ServicesRepository } from "../repository/services.repository";
import { readFile, utils } from "xlsx";
export class RegisterServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(pathFile: string, origin: string): Promise<void> {
    try {
      const workbook = readFile(pathFile);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      const dataToSave = jsonData.map((data) => {
        return {
          origin,
          order_service: data["Número OS"].trim(),
          start_date: RegisterServicesUseCase.getDate(
            data["Data Início Execução"].trim()
          ),
          finish_date: RegisterServicesUseCase.getDate(
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
    } catch (error) {
      throw error;
    } finally {
      if (existsSync(pathFile)) {
        unlinkSync(pathFile);
      }
    }
  }

  static getDate(dateString: string): Date {
    const date = dateString.split(" ")[0];
    const [day, month, year] = date.split("/").map(Number);
    const monthNumber = month - 1;

    return new Date(year, monthNumber, day, 3, 0);
  }
}
