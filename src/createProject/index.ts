import { createProjectArgsConfig, showCmdHelp } from '@/args';
import dirEmpty from '@/utils/dirEmpty';
import getDirectoryFiles from '@/utils/getDirectoryFiles';
import getRootDir from '@/utils/getRootDir';
import UserError from '@/utils/UserError';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import { parseArgs } from 'util';
import {
  promptAuthor,
  promptAuthorHandle,
  promptConfirm,
  promptDescription,
  promptDest,
  promptInstallTests,
  promptPhpNamespace,
  promptPhpVersion,
  promptPrefix,
  promptProjectType,
  promptSlug,
  promptTitle,
  promptVersion,
  promptWordpressVersion,
} from './prompts';
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
 * Check is the passed in type is valid project type
 *
 * @param type The type to check against.
 */
function isProjectType(type: unknown): type is ProjectType {
  return type === 'theme' || type === 'plugin';
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

  const dest = args.values.dest
    ? path.resolve(args.values.dest)
    : path.resolve(await promptDest());

  if (fs.existsSync(dest) && !dirEmpty(dest)) {
    throw new UserError(`Installation directory must be empty '${dest}'`);
  }

  const type = isProjectType(args.values.type)
    ? args.values.type
    : await promptProjectType();
  const title = args.values.title ? args.values.title : await promptTitle();
  const author = args.values.author ? args.values.author : await promptAuthor();
  const authorHandle = args.values.authorHandle
    ? args.values.authorHandle
    : await promptAuthorHandle(author);
  const description = args.values.description
    ? args.values.description
    : await promptDescription(title);
  const slug = args.values.slug ? args.values.slug : await promptSlug(title);
  const prefix = args.values.prefix
    ? args.values.prefix
    : await promptPrefix(title);
  const version = args.values.version
    ? args.values.version
    : await promptVersion();
  const phpNamespace = args.values.phpNamespace
    ? args.values.phpNamespace
    : await promptPhpNamespace(title);
  const wordpressVersion = args.values.wordpressVersion
    ? args.values.wordpressVersion
    : await promptWordpressVersion(wpData.wordpressVersion);
  const phpVersion = args.values.phpVersion
    ? args.values.phpVersion
    : await promptPhpVersion(wpData.phpVersion);
  const installTests = args.values.installTests
    ? args.values.installTests
    : await promptInstallTests();

  const [major, minor] = wordpressVersion.split('.');

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

  await promptConfirm(templateVars);

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
