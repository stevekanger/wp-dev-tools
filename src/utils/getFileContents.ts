import fs from 'fs';

/**
 * Gets a files contents
 *
 * @param filePath The path of the file to get
 */
export default function getFileContents(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, { encoding: 'utf8' }).toString();
  } catch (error) {
    return null;
  }
}
