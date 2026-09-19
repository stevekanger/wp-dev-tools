/**
 * Checks if a value is a string
 *
 * @param value The value to check against
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number
 *
 * @param value The value to check against
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Checks if a value is a boolean
 *
 * @param value The value to check against
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a function
 *
 * @param value The value to check against
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Checks if a value is one of the specified values
 *
 * @param ...values Any values you want to check
 */
export function isOneOf<T>(...values: T[]) {
  return (value: unknown): value is T => {
    return values.includes(value as T);
  };
}
