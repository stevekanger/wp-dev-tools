import readline from 'readline';

/**
 * Prompts a question in the command line
 *
 * @param question The question you want to ask
 * @param defaultAnswer The fallback if the user doesn't supply an answer
 * @param required Whether the response is required to contain a value
 *
 * @since 0.1.0
 */
export default async function commandLinePrompt(
  question: string,
  defaultAnswer: string = '',
  required: boolean = false,
): Promise<string> {
  question = `\n${question}`;
  question += `\n(default: ${defaultAnswer || '""'})`;
  question += `${required ? ' required' : ''}: `;

  while (true) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const response: string = await new Promise<string>((resolve) =>
      rl.question(question, resolve),
    );

    rl.close();

    const formattedResponse = response.trim() || defaultAnswer.trim();

    if (required && !formattedResponse) {
      continue;
    }

    return formattedResponse;
  }
}
