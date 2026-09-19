import UserError from './UserError';
import commandLinePrompt from './commandLinePrompt';
import normalizePath from './normalizePath';

/**
 * Prompts the user for a directory
 *
 * @param question The question to ask
 * @param fallback The default if user doesn't provide any input
 * @param required Whether an input is required or not (default: true)
 * @returns The resolved path
 */
export function promptDir(
  question: string,
  fallback: string = '',
  required: boolean = true,
): () => Promise<string> {
  return async function() {
    const answer = await commandLinePrompt(question, fallback, required);

    return normalizePath(answer);
  };
}

/**
 * Prompts the user for a string
 *
 * @param question The question to ask
 * @param fallback The default if user doesn't provide any input
 * @param required Whether an input is required or not (default: true)
 */
export function promptString(
  question: string,
  fallback: string = '',
  required: boolean = true,
): () => Promise<string> {
  return async function() {
    const answer = await commandLinePrompt(question, fallback, required);

    return answer;
  };
}

/**
 * Prompts the user for a yes or no
 *
 * @param question The question to ask
 * @param fallback The default if user doesn't provide any input
 * @param required Whether an input is required or not (default: true)
 */
export function promptBoolean(
  question: string,
  fallback: string = '',
  required: boolean = true,
): () => Promise<boolean> {
  return async function() {
    const answer = await commandLinePrompt(
      `${question} (y/n).`,
      fallback,
      required,
    );

    return answer.toLowerCase() === 'y';
  };
}

/**
 * Prompt the user for a list of values
 *
 * @param question The question to ask
 * @param values An array of values
 * @param fallback The default if user doesn't provide any input
 * @param required Whether an input is required or not (default: true)
 */
export function promptValues<T extends readonly unknown[]>(
  question: string,
  values: T,
  fallback?: string,
  required: boolean = true,
): () => Promise<T[number]> {
  return async function() {
    let msg = question + '\n';

    values.forEach((value, i) => {
      msg += `${i + 1}: ${value}\n`;
    });

    msg += `Choose a number. (1 - ${values.length})`;

    const answer = await commandLinePrompt(msg, fallback, required);
    const answerNumber = Number(answer);

    if (Number.isNaN(answerNumber) || !values[answerNumber - 1]) {
      throw new UserError(`Invalid selection ${answer}`);
    }

    return values[answerNumber - 1] as T[number];
  };
}

/**
 * Prompts the user to confirm their data
 *
 * @param data Object of data to confirm
 */
export async function promptConfirm(
  data: Record<string, string>,
): Promise<boolean> {
  let msg = `Please confirm your data.
=========================\n`;

  Object.entries(data).forEach(([key, value]) => {
    msg += `${key}: ${value}\n`;
  });

  msg += '\nIs this correct? (y/n): ';

  const answer = await commandLinePrompt(msg, '', true);

  if (answer.toLowerCase() !== 'y') {
    return false;
  }

  return true;
}
