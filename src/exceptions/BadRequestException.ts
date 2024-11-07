export class BadRequestException extends Error {
  public readonly success: boolean = false;
  public readonly statusCode: number = 400;
  public readonly name: string = "BadRequestException";
  public readonly error?: Error | string;

  constructor(message: string, error?: Error | string) {
    super(message);
    this.error = error;
  }

  serialize(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.statusCode,
      error: this.error,
    };
  }
}
