import { createProjectArgsConfig, showCmdHelp } from '@/args';
import { argOrPrompt } from '@/utils/argOrPrompt';
import dirEmpty from '@/utils/dirEmpty';
import getDirectoryFiles from '@/utils/getDirectoryFiles';
import getJsonFileContents from '@/utils/getJsonFileContents';
import getRootDir from '@/utils/getRootDir';
import {
  isMustache,
  removeMustacheExtension,
  renderMustache,
} from '@/utils/mustache';
import normalizePath from '@/utils/normalizePath';
import {
  promptBoolean,
  promptConfirm,
  promptDir,
  promptString,
  promptValues,
} from '@/utils/prompts';
import replaceFilenamePlaceholders from '@/utils/replaceFilenamePlaceholder';
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
import path from 'path';
import { parseArgs } from 'util';
import { ProjectTemplateVars, ProjectType, WpContentLocation } from './types';

/**
 * Gets the latest wordpress version from api
 */
async function getWordpressData(): Promise<{
  wordpressVersion: string;
  phpVersion: string;
}> {
  try {
    const wpVersionRes = await fetch(
      'https://api.wordpress.org/core/version-check/1.7/',
    );

    if (wpVersionRes.status !== 200) {
      throw new UserError(
        'Failed fetching wordpress version data. Please try again shortly.',
      );
    }

    const wpVersionData = await wpVersionRes.json();
    const wordpressVersion = wpVersionData.offers[0].version;
    const minPhp = wpVersionData.offers[0].php_version;

    const phpVersionRes = await fetch(
      `https://api.wordpress.org/core/serve-happy/1.0/?php_version=${minPhp}`,
    );

    if (phpVersionRes.status !== 200) {
      throw new UserError(
        'Failed fetching wordpress version and php data which can happen occasionally. Please try again shortly.',
      );
    }

    const { recommended_version: phpVersion } = await phpVersionRes.json();

    return {
      wordpressVersion,
      phpVersion,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Render template files from directory
 *
 * @param src The path of the template files
 * @param dest The path to render to
 * @param vars The mustache template variables
 */
async function renderFiles(
  src: string,
  dest: string,
  vars: ProjectTemplateVars,
) {
  getDirectoryFiles(src).forEach((fileName) => {
    const srcPath = path.join(src, fileName);
    let destPath = path.join(
      dest,
      removeMustacheExtension(
        replaceFilenamePlaceholders(fileName, {
          slug: vars.slug,
        }),
      ),
    );

    if (isMustache(fileName)) {
      renderMustache(srcPath, destPath, vars);
    } else {
      fs.cpSync(srcPath, destPath);
    }
  });
}

/**
 * Gets the wp-content location based on the project type
 *
 * @param type The project type
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

  const wpData = await getWordpressData();

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
    promptString('Version.', '1.0.0'),
    isString,
  );
  const phpNamespace = await argOrPrompt(
    args.values.phpNamespace,
    promptString('Php Namespace.', camelCase(title)),
    isString,
  );
  const wordpressVersion = await argOrPrompt(
    args.values.wordpressVersion,
    promptString('Wordpress version.', wpData.wordpressVersion),
    isString,
  );
  const phpVersion = await argOrPrompt(
    args.values.phpVersion,
    promptString('Php version.', wpData.phpVersion),
    isString,
  );
  const installTests = await argOrPrompt(
    args.values.installTests,
    promptBoolean('Install tests.', 'n'),
    isBoolean,
  );

  const [major, minor] = wordpressVersion.split('.');

  const confirmed = await promptConfirm({
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
    ['Install Tests']: installTests ? 'Yes' : 'No',
  });

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
    wordpressVersionMajorMinor: `${major}.${minor}`,
    phpVersion,
    installTests,
    wpContentLocation: getWpContentLocation(type),
    devToolsVersion,
  };

  [
    getRootDir('templates', 'project-base'),
    getRootDir('templates', `project-${type}`),
  ].forEach((src) => renderFiles(src, dest, templateVars));

  if (installTests) {
    renderFiles(getRootDir('templates', 'project-tests'), dest, templateVars);
  }

  const mainFileName = type === 'plugin' ? `${slug}.php` : 'style.css';

  console.log(`
  Finished!
  Go to readme.txt and ${mainFileName} to fill in any relevant information.
  `);
}
