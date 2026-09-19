import commandLinePrompt from '@/utils/commandLinePrompt';
import UserError from '@/utils/UserError';
import { ArchiveType } from './types';

/**
 * Prompts the user if the current stated version is correct.
 *
 * @param currentVersion The current version from both header and entry files
 */
export async function promptVersion(currentVersion: string): Promise<string> {
  const answer = await commandLinePrompt(
    `Current stated version is '${currentVersion}'. Is this correct? (y/n).`,
    '',
    true,
  );

  if (answer.toLowerCase() !== 'y') {
    throw new UserError('Version not confirmed.');
  }

  return answer;
}

/**
 * Prompts the user for the type of files to process
 */
export async function promptType(): Promise<ArchiveType> {
  const answer = await commandLinePrompt(
    'What do you want to archive? (select a number)\n1: Distribution files only\n2: All development files',
    '',
    true,
  );

  switch (answer) {
    case '1':
      return 'dist';
    case '2':
      return 'dev';
    default:
      throw new UserError(`Invalid selection ${answer}`);
  }
}

/**
 * Prompts the user for the source directory.
 */
export async function promptSrc(): Promise<string> {
  const answer = await commandLinePrompt('Source directory.', '', true);

  return answer;
}

/**
 * Prompts the user for the source directory.
 */
export async function promptDest(): Promise<string> {
  const answer = await commandLinePrompt('Destination directory.', '', true);

  return answer;
}
