import { CopyType } from './types';
import commandLinePrompt from '@/utils/commandLinePrompt';
import UserError from '@/utils/UserError';

/**
 * Prompts the user for the type of files to process
 */
export async function promptType(): Promise<CopyType> {
  const answer = await commandLinePrompt(
    'What do you want to copy? (select a number)\n1: Distribution files only\n2: All development files',
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
 * Prompts the user for the destination directory.
 */
export async function promptDest(): Promise<string> {
  const answer = await commandLinePrompt('Destination directory.', '', true);

  return answer;
}
