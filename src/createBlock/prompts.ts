import commandLinePrompt from '@/utils/commandLinePrompt';
import { BlockType } from './types';
import UserError from '@/utils/UserError';
import { kebabCase, uppercaseFirstOnly } from '@/utils/strings';
import getEnv from '@/utils/getEnv';

/*
 * Prompts the user for the boilerplate type
 */
export async function promptType(): Promise<BlockType> {
  const answer = await commandLinePrompt(
    'Block type? (enter the number)\n1: Static\n2: Dynamic',
    '',
    true,
  );

  switch (answer) {
    case '1':
      return 'static';
    case '2':
      return 'dynamic';
    default:
      throw new UserError(`Invalid selection ${answer}`);
  }
}

/**
 * Prompts the user for the destination directory.
 *
 * @param slug The block slug
 */
export function promptDest(slug: string): () => Promise<string> {
  return async () => {
    const answer = await commandLinePrompt(
      'Destination directory.',
      `./src/blocks/${slug}`,
    );

    return answer;
  };
}

/**
 * Prompts the user for the title.
 */
export async function promptTitle(): Promise<string> {
  const answer = await commandLinePrompt('Block title.', '', true);

  return answer;
}

/**
 * Prompts the user for the slug
 *
 * @param title The user specified title
 */
export function promptSlug(title: string): () => Promise<string> {
  return async () => {
    const fromTitle = kebabCase(title);

    const answer = await commandLinePrompt(
      'Slug. Example "my-awesome-block".',
      fromTitle,
    );

    return answer;
  };
}

/**
 * Prompts the user for the namespace
 */
export async function promptNamespace(): Promise<string> {
  const fromEnv = getEnv('SLUG', '');

  const answer = await commandLinePrompt(
    'Namespace. Example "my-awesome-project".',
    fromEnv,
    true,
  );

  return answer;
}

/**
 * Prompts the user for the textdomain
 */
export async function promptTextDomain(): Promise<string> {
  const fromEnv = getEnv('SLUG', '');

  const answer = await commandLinePrompt(
    'Textdomain. Example "my-awesome-project".',
    fromEnv,
    true,
  );

  return answer;
}

/**
 * Prompts the user for the description
 *
 * @param title The user defined title
 */
export function promptDescription(title: string): () => Promise<string> {
  return async () => {
    const fromTitle = uppercaseFirstOnly(title) + '.';

    const answer = await commandLinePrompt('Description.', fromTitle);

    return answer;
  };
}
