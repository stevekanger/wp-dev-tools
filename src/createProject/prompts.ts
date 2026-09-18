import commandLinePrompt from '@/utils/commandLinePrompt';
import { ProjectTemplateVars, ProjectType } from './types';
import { INITIAL_VERSION } from '@/constants';
import { UserError } from '@/utils/UserError';

/**
 * Prompts the user for the boilerplate type
 */
export async function promptProjectType(): Promise<ProjectType> {
  const answer = await commandLinePrompt(
    'What to create? (enter the number)\n1: Theme\n2: Plugin',
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
    `Project title (eg. Super Cool Project).`,
    '',
    true,
  );

  return answer
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Prompts the user for the author
 */
export async function promptAuthor(): Promise<string> {
  const answer = await commandLinePrompt(
    `Author Full Name (eg. John Doe).`,
    '',
    true,
  );

  return answer
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Prompts the user for the author handle
 */
export async function promptAuthorHandle(author: string): Promise<string> {
  const fromAuthor = author.toLowerCase().replaceAll(' ', '');

  const answer = await commandLinePrompt(
    'Author handle (eg. johndoe).',
    fromAuthor,
  );

  return answer;
}

/**
 * Prompts the user for the description
 *
 * @param title The user specified title
 */
export async function promptDescription(title: string): Promise<string> {
  const fromTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase() + '.';

  const answer = await commandLinePrompt('Description.', fromTitle);

  return answer;
}

/**
 * Prompts the user for the slug
 *
 * @param title The user specified title
 */
export async function promptSlug(title: string): Promise<string> {
  const fromTitle = title.toLowerCase().replaceAll(' ', '-');
  const answer = await commandLinePrompt('Slug.', fromTitle);

  return answer;
}

/**
 * Prompts the user for the prefix
 *
 * @param title The user specified title
 */
export async function promptPrefix(title: string): Promise<string> {
  const fromTitle = title.toLowerCase().replaceAll(' ', '_');
  const answer = await commandLinePrompt('Prefix.', fromTitle);

  return answer;
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
export async function promptPhpNamespace(title: string): Promise<string> {
  const fromTitle = title
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const answer = await commandLinePrompt('Php namespace.', fromTitle);

  return answer;
}

/**
 * Prompts the user for the target wordpress version
 *
 * @param latest The latest wordpress version
 */
export async function promptWordpressVersion(latest: string): Promise<string> {
  const answer = await commandLinePrompt('Target wordpress version.', latest);

  return answer;
}

/**
 * Prompts the user for the minimum php version
 *
 * @param recommended The wordpress recommended minimum php version
 */
export async function promptPhpVersion(minPhpVersion: string): Promise<string> {
  const answer = await commandLinePrompt('Minimum php version.', minPhpVersion);

  return answer;
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
 * @param type The type of project to create
 * @param title The user specified title
 * @param author The user specified author
 * @param slug The user specified slug
 * @param prefix The user specified prefix
 * @param version The user specified version
 * @param phpNamespace The user specified phpNamespace
 * @param wordrpessVersion The user specified wordpress version
 * @param phpVersion The user specified php version
 * @param installPath The user specified installation path
 * @param installTests Whether to install tests or not
 */
export async function promptConfirm({
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
  installPath,
  installTests,
}: ProjectTemplateVars): Promise<string> {
  const answer = await commandLinePrompt(
    `
Your Data
-----------------------
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
Install Path: ${installPath}
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
