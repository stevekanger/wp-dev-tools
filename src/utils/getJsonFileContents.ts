import fs from 'fs';

/**
 * Reads and parses a json file
 *
 * @param filePath The path of the file to get
 */
export default function getJsonFileContents<T>(filePath: string): T | null {
  try {
    return JSON.parse(
      fs.readFileSync(filePath, { encoding: 'utf8' }).toString(),
    );
  } catch (error) {
    return null;
  }
}
