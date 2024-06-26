import { ServicesRepository } from "../repository/services.repository";

export class ListLastInsertsUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(location: string) {
    return this.repository.getLastInserts(location);
  }
}
