export default class UserError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'UserError';
    if (cause) this.cause = cause as Error;
  }
}
