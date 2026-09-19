import fs from 'fs';

/**
 * Ensure directory exists else create it
 *
 * @param dir The directory to check
 */
export default function ensureDir(dir: string): string {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return dir;
}
