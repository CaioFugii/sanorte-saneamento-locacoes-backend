import { ServicesRepository } from "../repository/services.repository";

export class RegisterServicesUseCase {
  constructor(repository: ServicesRepository) {}
  execute(payload: any) {
    return {
      payload,
    };
  }
}
