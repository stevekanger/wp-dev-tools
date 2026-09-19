import os from 'os';
import path from 'path';

/**
 * Resolves path and if starts with ~ replace with user home dir
 *
 * @param p The path string
 */
export default function normalizePath(p: string): string {
  if (p === '~' || p.startsWith('~/')) {
    p = os.homedir() + p.slice(1);
  }

  return path.resolve(p);
}
