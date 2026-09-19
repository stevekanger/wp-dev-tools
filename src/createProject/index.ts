import { createProjectArgsConfig, showCmdHelp } from '@/args';
import { argOrPrompt } from '@/utils/argOrPrompt';
import dirEmpty from '@/utils/dirEmpty';
import getDirectoryFiles from '@/utils/getDirectoryFiles';
import getRootDir from '@/utils/getRootDir';
import normalizePath from '@/utils/normalizePath';
import {
  promptBoolean,
  promptConfirm,
  promptDir,
  promptString,
  promptValues,
} from '@/utils/prompts';
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
import mustache from 'mustache';
import path from 'path';
import { parseArgs } from 'util';
import { ProjectTemplateVars, ProjectType } from './types';

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
        'Failed fetching wordpress php version data. Please try again shortly.',
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
 * Gets the destination file path
 *
 * @param {string} destDir The destination directory
 * @param {string} fileName The name of the file relative to destDir
 * @param {boolean} isRenderableMustache Wether to render the mustache file or not
 * @param {TemplateVars} vars The template variables
 */
function getDestPath(
  destDir: string,
  fileName: string,
  isRenderableMustache: boolean,
  vars: ProjectTemplateVars,
): string {
  const parsed = path.parse(path.join(destDir, fileName));

  // parse out any filename placeholders
  if (parsed.base.includes('[slug]')) {
    parsed.base = parsed.base.replace('[slug]', vars.slug);
    parsed.name = parsed.name.replace('[slug]', vars.slug);
  }

  if (isRenderableMustache) {
    return `${parsed.dir}/${parsed.name}`;
  }

  return `${parsed.dir}/${parsed.base}`;
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
  const files = getDirectoryFiles(src);

  files.forEach((fileName) => {
    const isRenderableMustache = fileName.endsWith('.mustache');

    const srcPath = path.join(src, fileName);
    const destPath = getDestPath(dest, fileName, isRenderableMustache, vars);

    if (isRenderableMustache) {
      const fileContents = fs.readFileSync(srcPath, 'utf8');
      const rendered = mustache.render(fileContents, vars);

      if (rendered) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, rendered, 'utf8');
      }
    } else {
      fs.cpSync(srcPath, destPath);
    }
  });
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
    typeProper: type === 'plugin' ? 'Plugin' : 'Theme',
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
    wpContentLocation: type === 'plugin' ? 'plugins' : 'themes',
  };

  // Render base files
  renderFiles(
    getRootDir('templates', 'createProject', 'base'),
    dest,
    templateVars,
  );

  // Render template specific files
  renderFiles(
    getRootDir('templates', 'createProject', type),
    dest,
    templateVars,
  );

  // Render tests if needed
  if (installTests) {
    renderFiles(
      getRootDir('templates', 'createProject', 'tests'),
      dest,
      templateVars,
    );
  }

  const mainFileName = type === 'plugin' ? `${slug}.php` : 'style.css';

  console.log(`
  Finished!
  Go to readme.txt and ${mainFileName} to fill in any more relevant information.
  `);
}
