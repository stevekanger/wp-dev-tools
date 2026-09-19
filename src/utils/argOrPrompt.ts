import { ArgValidator } from '@/types';

/**
 * If a command line argument exists validate it or prompt the user
 *
 * @param arg The arg to check
 * @param prompt The prompt to run if a user
 */
export async function argOrPrompt<T>(
  arg: unknown,
  prompt: () => Promise<T>,
  validator: ArgValidator<T>,
): Promise<T> {
  if (arg && validator(arg)) {
    return arg;
  }

  return await prompt();
}
