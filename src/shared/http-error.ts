export class HttpError extends Error {
  public message: string;
  public code: number;
  constructor(message: string, code: number) {
    super();
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message || "Internal server error.";
    this.code = code || 500;
  }
}
