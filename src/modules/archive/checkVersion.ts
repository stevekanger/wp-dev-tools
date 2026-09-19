import getFileContents from '@/utils/getFileContents';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';

/**
 * Matches the version from the docblock header.
 *
 * Example matched line:
 *   * Version: 0.1.0
 *
 * Breakdown:
 *   Version:  = literal docblock "Version:" line
 *   \s*          = optional whitespace after the colon
 *   ([0-9.]+)    = captures the version number (digits and dots)
 *
 * match[1] will contain the version string.
 */
const headerMatchRegex = /Version:\s*([0-9.]+)/;

/**
 * Gets the version from header comment.
 *
 * @param mainFilePath The path to the file
 */
function getHeaderVersion(mainFilePath: string) {
  const content = getFileContents(mainFilePath);

  if (!content) {
    throw new UserError(`Could not find entry file at ${mainFilePath}`);
  }

  const headerMatch = content.match(headerMatchRegex);

  if (!headerMatch || !headerMatch[1]) {
    throw new UserError('Could not find the version in header.');
  }

  return headerMatch[1];
}

/**
 * Logs the package versions in command line
 *
 * @param packageVersion
 * @param headerVersion
 */
function showVersions(
  packageVersion: string,
  headerVersion: string,
  mainFilePath: string,
) {
  console.log(`
=========================================
Versions 
-----------------------------------------
package.json = ${packageVersion} 
${path.basename(mainFilePath)} = ${headerVersion}
=========================================
  `);
}

/**
 * Checks versions in all relevant files to make sure they are the same
 *
 * @param mainFilePath The path to the entry file
 * @param packageJsonVersion The version stated in package.json
 */
export default function checkVersion(
  mainFilePath: string,
  packageJsonVersion: string,
) {
  if (!fs.existsSync(mainFilePath)) {
    throw new UserError(`No entry file found at '${mainFilePath}'`);
  }

  const headerVersion = getHeaderVersion(mainFilePath);
  const versions = [packageJsonVersion, headerVersion];
  const allMatch = versions.every((v) => v === packageJsonVersion);

  if (!allMatch) {
    showVersions(packageJsonVersion, headerVersion, mainFilePath);
    throw new UserError('You have mismatch versions in your files.');
  }
}
