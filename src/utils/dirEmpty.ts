import fs from 'fs';

/**
 * Check if a directory is empty
 *
 * @param dir The directory path to check
 */
export default function dirEmpty(dir: string) {
  return fs.readdirSync(dir).length === 0;
}
