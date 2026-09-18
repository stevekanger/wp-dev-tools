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
