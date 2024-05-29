import { HttpError } from "./http-error";

type Errors = {
  property: string;
  message: string;
};
export class BadRequestError extends HttpError {
  public errors: Errors[];
  constructor(errors: Errors[]) {
    super("Bad request error", 400);
    this.name = this.constructor.name;
    this.errors = errors;
  }
}
