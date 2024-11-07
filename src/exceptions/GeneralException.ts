export class GeneralException extends Error {
  public readonly success: boolean = false;
  public readonly status: number;
  public readonly error?: Error | string;
  public readonly name: string = "GeneralException";

  constructor(status: number, message: string, stack?: string) {
    super(message);
    this.status = status;
    if (stack) {
      this.error = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  serialize(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      error: this.error,
    };
  }
}
