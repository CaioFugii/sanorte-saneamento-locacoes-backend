import { ServicesRepository } from "../repository/services.repository";

export class RegisterServicesUseCase {
  constructor(repository: ServicesRepository) {}
  async execute(pathFile: string): Promise<void> {
    console.log(pathFile);
    Promise.resolve();
    return;
  }
}
