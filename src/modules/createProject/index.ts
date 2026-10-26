import { createProjectArgsConfig, showCmdHelp } from '@/args';
import { INITIAL_VERSION } from '@/constants';
import { argOrPrompt } from '@/utils/argOrPrompt';
import dirEmpty from '@/utils/dirEmpty';
import getJsonFileContents from '@/utils/getJsonFileContents';
import getRootDir from '@/utils/getRootDir';
import getWpData from '@/utils/getWpData';
import normalizePath from '@/utils/normalizePath';
import {
  promptBoolean,
  promptConfirm,
  promptDir,
  promptString,
  promptValues,
} from '@/utils/prompts';
import renderTemplateDirectory from '@/utils/renderTemplateDirectory';
import {
  camelCase,
  kebabCase,
  lowercaseRemoveSpaces,
  snakeCase,
  uppercaseFirstOnly,
} from '@/utils/strings';
import { isBoolean, isOneOf, isString } from '@/utils/typeChecks';
import UserError from '@/utils/UserError';
import fs from 'fs';
import { parseArgs } from 'util';
import { ProjectTemplateVars, ProjectType, WpContentLocation } from './types';

/**
 * Render the project files
 *
 * @param dest - The destination directory
 * @param type - The project type
 * @param templateVars - The template variables
 */
export function renderProjectFiles(
  dest: string,
  type: ProjectType,
  templateVars: ProjectTemplateVars,
): void {
  const templates = [
    getRootDir('templates', 'project-base'),
    getRootDir('templates', `project-${type}`),
  ];

  if (templateVars.installTests) {
    templates.push(getRootDir('templates', 'project-tests'));
  }

  if (templateVars.installPhpSuite) {
    templates.push(getRootDir('templates', 'project-php-suite'));

    if (templateVars.installTests) {
      templates.push(getRootDir('templates', 'project-tests-php-suite'));
    }
  }

  templates.forEach((src) =>
    renderTemplateDirectory(src, dest, templateVars, {
      slug: templateVars.slug,
    }),
  );
}

/**
 * Gets the wp-content location based on the project type
 *
 * @param type - The project type
 */
function getWpContentLocation(type: ProjectType): WpContentLocation {
  switch (type) {
    case 'theme':
      return 'themes';
    case 'plugin':
      return 'plugins';
    default:
      throw new Error('Invalid project type getting wp content location.');
  }
}

/**
 * Creates a wordpress project
 */
export default async function createProject() {
  const args = parseArgs(createProjectArgsConfig);

  if (args.values.help) {
    showCmdHelp(createProjectArgsConfig);
    return;
  }

  const { recommendedWpVersion, recommendedPhpVersion } = await getWpData();

  const dest = await argOrPrompt(
    normalizePath(args.values.dest),
    promptDir('Destination location.'),
    isString,
  );

  if (fs.existsSync(dest) && !dirEmpty(dest)) {
    throw new UserError(`Installation directory must be empty '${dest}'`);
  }

  const packageJson = getJsonFileContents<{ version: string }>(
    getRootDir('package.json'),
  );

  if (!packageJson) {
    throw new Error('Could not find in tools root dir package.json.');
  }

  const { version: devToolsVersion } = packageJson;

  const type: ProjectType = await argOrPrompt(
    args.values.type,
    promptValues('Project type.', ['theme', 'plugin'] as const),
    isOneOf('theme', 'plugin'),
  );
  const title = await argOrPrompt(
    args.values.title,
    promptString('Title. Example "My Awesome Thing".'),
    isString,
  );
  const author = await argOrPrompt(
    args.values.author,
    promptString('Author full name. Example "John Doe".'),
    isString,
  );
  const authorHandle = await argOrPrompt(
    args.values.authorHandle,
    promptString(
      'Author handle. Example "johndoe".',
      lowercaseRemoveSpaces(author),
    ),
    isString,
  );
  const description = await argOrPrompt(
    args.values.description,
    promptString('Description.', uppercaseFirstOnly(title) + '.'),
    isString,
  );
  const slug = await argOrPrompt(
    args.values.slug,
    promptString(
      'Slug. Kebab case. Example "my-awesome-thing".',
      kebabCase(title),
    ),
    isString,
  );
  const prefix = await argOrPrompt(
    args.values.prefix,
    promptString(
      'Prefix. Snake case. Example "my_awesome_thing".',
      snakeCase(title),
    ),
    isString,
  );
  const version = await argOrPrompt(
    args.values.version,
    promptString('Version.', INITIAL_VERSION),
    isString,
  );
  const phpNamespace = await argOrPrompt(
    args.values.phpNamespace,
    promptString('Php Namespace.', camelCase(title)),
    isString,
  );
  const wordpressVersion = await argOrPrompt(
    args.values.wordpressVersion,
    promptString('Wordpress version.', recommendedWpVersion),
    isString,
  );
  const phpVersion = await argOrPrompt(
    args.values.phpVersion,
    promptString('Php version.', recommendedPhpVersion),
    isString,
  );

  const installPhpSuite = await argOrPrompt(
    args.values.installPhpSuite,
    promptBoolean('Install full php suite?'),
    isBoolean,
  );

  const installTests = await argOrPrompt(
    args.values.installTests,
    promptBoolean('Install tests?', ''),
    isBoolean,
  );

  const confirmed = await argOrPrompt(
    args.values.confirm,
    promptConfirm({
      ['Destination']: dest,
      ['Project Type']: type,
      ['Title']: title,
      ['Author']: author,
      ['Author Handle']: authorHandle,
      ['Description']: description,
      ['Slug']: slug,
      ['Prefix']: prefix,
      ['version']: version,
      ['Php Namespace']: phpNamespace,
      ['Wordpress Version']: wordpressVersion,
      ['Php Version']: phpVersion,
      ['Install Php Suite']: installPhpSuite ? 'Yes' : 'No',
      ['Install Tests']: installTests ? 'Yes' : 'No',
    }),
    isBoolean,
  );

  if (!confirmed) {
    throw new UserError('Data not confirmed.');
  }

  const templateVars: ProjectTemplateVars = {
    dest,
    type,
    isPlugin: type === 'plugin',
    isTheme: type === 'theme',
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
    installPhpSuite,
    installTests,
    wpContentLocation: getWpContentLocation(type),
    devToolsVersion,
  };

  renderProjectFiles(dest, type, templateVars);

  const mainFileName = type === 'plugin' ? `${slug}.php` : 'style.css';

  console.log(`
===============
== Finished! ==
===============

Cd into your project. Fill in relevant information in readme.txt and ${mainFileName}. Then run the following commands.

npm install
composer install
composer dump-autoload
  `);
}
