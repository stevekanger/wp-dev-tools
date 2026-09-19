import commandLinePrompt from '@/utils/commandLinePrompt';

/**
 * Prompt the user for the docker container
 */
export async function promptContainer(): Promise<string> {
  const answer = await commandLinePrompt('Docker container name.', '', true);

  return answer;
}

/**
 * Prompt the user for the source
 */
export async function promptSrc(): Promise<string> {
  const answer = await commandLinePrompt(
    'Source relative to wp-content. Example "themes/my-awesome-theme"',
    '',
    true,
  );

  return answer;
}

/**
 * Prompt the user for the destination
 */
export async function promptDest(): Promise<string> {
  const answer = await commandLinePrompt('Destination.', '', true);

  return answer;
}
