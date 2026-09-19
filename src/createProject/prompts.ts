import { INITIAL_VERSION } from '@/constants';
import UserError from '@/utils/UserError';
import commandLinePrompt from '@/utils/commandLinePrompt';
import {
  camelCase,
  kebabCase,
  lowercaseRemoveSpaces,
  snakeCase,
  uppercaseFirstOnly,
} from '@/utils/strings';
import { ProjectTemplateVars, ProjectType } from './types';

/**
 * Prompts the user for the source directory.
 */
export async function promptDest(): Promise<string> {
  const answer = await commandLinePrompt('Destination directory.', '', true);

  return answer;
}

/*
 * Prompts the user for the boilerplate type
 */
export async function promptType(): Promise<ProjectType> {
  const answer = await commandLinePrompt(
    'Project type? (enter the number)\n1: Theme\n2: Plugin',
    '',
    true,
  );

  switch (answer) {
    case '1':
      return 'theme';
    case '2':
      return 'plugin';
    default:
      throw new UserError(`Invalid selection ${answer}`);
  }
}

/**
 * Prompts the user for the title
 */
export async function promptTitle(): Promise<string> {
  const answer = await commandLinePrompt(
    `Project title. Example "My Awesome Project".`,
    '',
    true,
  );

  return answer;
}

/**
 * Prompts the user for the author
 */
export async function promptAuthor(): Promise<string> {
  const answer = await commandLinePrompt(
    `Author Full Name. Example "John Doe".`,
    '',
    true,
  );

  return answer;
}

/**
 * Prompts the user for the author handle
 */
export function promptAuthorHandle(author: string): () => Promise<string> {
  return async () => {
    const fromAuthor = lowercaseRemoveSpaces(author);

    const answer = await commandLinePrompt(
      'Author handle. Example "johndoe".',
      fromAuthor,
    );

    return answer;
  };
}

/**
 * Prompts the user for the description
 *
 * @param title The user specified title
 */
export function promptDescription(title: string): () => Promise<string> {
  return async () => {
    const fromTitle = uppercaseFirstOnly(title) + '.';

    const answer = await commandLinePrompt('Description.', fromTitle);

    return answer;
  };
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
      'Slug. Kebab case. Example "my-awesome-project".',
      fromTitle,
    );

    return answer;
  };
}

/**
 * Prompts the user for the prefix
 *
 * @param title The user specified title
 */
export function promptPrefix(title: string): () => Promise<string> {
  return async () => {
    const fromTitle = snakeCase(title);

    const answer = await commandLinePrompt(
      'Prefix. Snake case. Example "my_awesome_project".',
      fromTitle,
    );

    return answer;
  };
}

/**
 * Prompts user for the initial project version
 */
export async function promptVersion(): Promise<string> {
  const answer = await commandLinePrompt('Initial Version.', INITIAL_VERSION);

  return answer;
}

/**
 * Prompts the user for the php namespace
 *
 * @param title The user specified title
 */
export function promptPhpNamespace(title: string): () => Promise<string> {
  return async () => {
    const fromTitle = camelCase(title);

    const answer = await commandLinePrompt(
      'Php namespace. Example "MyAwesomeProject".',
      fromTitle,
    );

    return answer;
  };
}

/**
 * Prompts the user for the target wordpress version
 *
 * @param latest The latest wordpress version
 */
export function promptWordpressVersion(latest: string): () => Promise<string> {
  return async () => {
    const answer = await commandLinePrompt('Target wordpress version.', latest);

    return answer;
  };
}

/**
 * Prompts the user for the minimum php version
 *
 * @param recommended The wordpress recommended minimum php version
 */
export function promptPhpVersion(minPhpVersion: string): () => Promise<string> {
  return async () => {
    const answer = await commandLinePrompt(
      'Minimum php version.',
      minPhpVersion,
    );

    return answer;
  };
}

/**
 * Prompt the user whether to install tests
 */
export async function promptInstallTests(): Promise<boolean> {
  const answer = await commandLinePrompt('Install Tests (y/n).', 'n');

  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * Prompts the user to confirm their choices
 *
 * @param dest The user specified installation destination
 * @param type The type of project to create
 * @param title The user specified title
 * @param author The user specified author
 * @param slug The user specified slug
 * @param prefix The user specified prefix
 * @param version The user specified version
 * @param phpNamespace The user specified phpNamespace
 * @param wordrpessVersion The user specified wordpress version
 * @param phpVersion The user specified php version
 * @param installTests Whether to install tests or not
 */
export async function promptConfirm({
  dest,
  type,
  title,
  author,
  authorHandle,
  description,
  slug,
  prefix,
  version,
  phpNamespace,
  wordpressVersion,
  phpVersion,
  installTests,
}: ProjectTemplateVars): Promise<string> {
  const answer = await commandLinePrompt(
    `
Your Data
-----------------------
Install Location: ${dest}
Type: ${type}
Title: ${title}
Author: ${author}
Author Handle: ${authorHandle}
Description: ${description}
Slug: ${slug}
Prefix: ${prefix}
Version: ${version}
Php namespace: ${phpNamespace}
Wordpress version: ${wordpressVersion}
Php version: ${phpVersion}
Install Tests: ${installTests ? 'Yes' : 'No'}

Is this correct? (y/n).`,
    '',
    true,
  );

  if (answer.toLowerCase() !== 'y') {
    throw new UserError('Data not confirmed.');
  }

  return answer;
}
