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
  promptType,
  promptSlug,
  promptTitle,
  promptVersion,
  promptWordpressVersion,
} from './prompts';
import { ProjectTemplateVars } from './types';
import { isString, isBoolean } from '@/utils/typeChecks';
import { argOrPrompt } from '@/utils/argOrPrompt';

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

  const dest = args.values.dest
    ? path.resolve(args.values.dest)
    : path.resolve(await promptDest());

  if (fs.existsSync(dest) && !dirEmpty(dest)) {
    throw new UserError(`Installation directory must be empty '${dest}'`);
  }

  const type = await argOrPrompt(
    args.values.type,
    promptType,
    (arg) => arg === 'theme' || arg === 'plugin',
  );
  const title = await argOrPrompt(args.values.title, promptTitle, isString);
  const author = await argOrPrompt(args.values.author, promptAuthor, isString);
  const authorHandle = await argOrPrompt(
    args.values.authorHandle,
    promptAuthorHandle(author),
    isString,
  );
  const description = await argOrPrompt(
    args.values.description,
    promptDescription(title),
    isString,
  );
  const slug = await argOrPrompt(args.values.slug, promptSlug(title), isString);
  const prefix = await argOrPrompt(
    args.values.prefix,
    promptPrefix(title),
    isString,
  );
  const version = await argOrPrompt(
    args.values.version,
    promptVersion,
    isString,
  );
  const phpNamespace = await argOrPrompt(
    args.values.phpNamespace,
    promptPhpNamespace(title),
    isString,
  );
  const wordpressVersion = await argOrPrompt(
    args.values.wordpressVersion,
    promptWordpressVersion(wpData.wordpressVersion),
    isString,
  );
  const phpVersion = await argOrPrompt(
    args.values.phpVersion,
    promptPhpVersion(wpData.phpVersion),
    isString,
  );
  const installTests = await argOrPrompt(
    args.values.installTests,
    promptInstallTests,
    isBoolean,
  );

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
