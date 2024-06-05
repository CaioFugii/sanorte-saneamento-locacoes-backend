import { add, differenceInDays, format, isBefore } from "date-fns";
import { ServicesRepository } from "../repository/services.repository";
import { HttpError } from "../shared/http-error";

export class ListCompletedServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(filter: {
    location: string[];
    range: { from: string; to: string };
  }) {
    if (!filter.range.from || !filter.range.to) {
      throw new HttpError("Range of dates is required", 400);
    }

    const filterDate = {
      from: new Date(filter.range?.from),
      to: add(new Date(filter.range?.to), { hours: 20 }),
    };

    const valid = ListCompletedServicesUseCase.validateDates(filterDate);

    if (!valid) {
      throw new HttpError("Invalid dates", 400);
    }

    return await this.repository.find({
      location: filter.location,
      range: {
        from: ListCompletedServicesUseCase.formatDate(filterDate.from),
        to: ListCompletedServicesUseCase.formatDate(filterDate.to),
      },
    });
  }

  static validateDates(range: { from: Date; to: Date }): boolean {
    if (isBefore(range.to, range.from)) {
      return false;
    }

    if (differenceInDays(range.from, range.to) >= 32) {
      return false;
    }
    return true;
  }

  static formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }
}
