/**
 * Replaces any placeholders in a filename
 *
 * @param filename The fileame to check against
 * @param placeholders The placeholders to replace
 */
export default function replaceFilenamePlaceholders(
  filename: string,
  placeholders: Record<string, string>,
): string {
  let result = filename;

  for (const [key, value] of Object.entries(placeholders)) {
    result = result.split(`[${key}]`).join(value);
  }

  return result;
}
