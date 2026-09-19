/**
 * Create camel case string
 *
 * @param str The string to process
 */
export function camelCase(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Create kebab case string
 *
 * @param str The string to process
 */
export function kebabCase(str: string): string {
  return str.toLowerCase().replaceAll(' ', '-');
}

/**
 * Create snake case string
 *
 * @param str The string to process
 */
export function snakeCase(str: string): string {
  return str.toLowerCase().replaceAll(' ', '_');
}

/**
 * Create lowercase string with no spaces
 *
 * @param str The string to process
 */
export function lowercaseRemoveSpaces(str: string): string {
  return str.toLowerCase().replaceAll(' ', '');
}

/**
 * Uppercase all words in string
 *
 * @param str The string to process
 */
export function uppercaseWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Uppercase only first word in string others will be lowercase
 *
 * @param str The string to process
 */
export function uppercaseFirstOnly(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
