export class BaseError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
