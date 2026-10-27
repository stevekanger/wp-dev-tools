/**
 * UserError class.
 *
 * Used to display a custom error message to the user.
 */
export default class UserError extends Error {
  /**
   * UserError class constructor.
   *
   * @param message The message to display.
   * @param cause The Error class cause.
   */
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'UserError';
    if (cause) this.cause = cause as Error;
  }
}
