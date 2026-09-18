import path from 'path';

/**
 * Gets the current working directory the script was called from
 *
 * @param ...paths Any extra paths. They will be joined with `path.join`
 * @return The full path to the cwd and any extra if passed in
 */
export default function getCwd(...paths: string[]): string {
  return path.join(process.cwd(), ...paths);
}
