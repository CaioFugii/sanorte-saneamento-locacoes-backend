import { differenceInDays, differenceInHours, parseISO } from "date-fns";
import { format as formatTz } from "date-fns-tz";
import { ServicesRepository } from "../repository/services.repository";
import { mappedMetrics, mappedServices } from "../shared/constants";
import { updateSummary } from "./shared/update-summary";

export class ListCompletedServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(filter: { location: string }) {
    const resultMalFormatted = await this.repository.findCompletedServices({
      location: filter.location,
    });

    const resultWithType = resultMalFormatted.map(
      ListCompletedServicesUseCase.mapTypeService
    );
    const result = [];

    Object.keys(mappedMetrics).forEach((type) => {
      const summary = mappedMetrics[type].values.reduce(
        (a, v) => ({
          ...a,
          [`até ${v} ${mappedMetrics[type].type}`]: 0,
          [`até ${v} ${mappedMetrics[type].type} - %`]: 0,
        }),
        { Atrasados: 0, [`Atrasados - %`]: 0, Total: 0 }
      );

      let collection = {
        tableName: type,
        summary,
        values: [],
      };
      collection.values = resultWithType.filter((item) => item.type === type);
      if (collection.values.length) {
        result.push(collection);
      }
    });

    return updateSummary(result);
  }

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
  }) {
    const tssName = data.tss.trim();

    const type = mappedServices[tssName] ?? "AGUA - GERAL";

    return {
      ...data,
      start_date: formatTz(data.start_date, "yyyy-MM-dd HH:mm:ss", {
        timeZone: "America/Sao_Paulo",
      }),
      finish_date: formatTz(data.finish_date, "yyyy-MM-dd HH:mm:ss", {
        timeZone: "America/Sao_Paulo",
      }),
      type,
    };
  }
}
