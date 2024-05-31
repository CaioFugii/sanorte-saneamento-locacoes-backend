import { ServicesRepository } from "../repository/services.repository";

export class ListServicesUseCase {
  constructor(repository: ServicesRepository) {}
  execute(payload: any) {
    return {
      payload,
    };
  }
}
