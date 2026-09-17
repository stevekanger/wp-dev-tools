import { createProjectArgsConfig } from '@/args';
import dirEmpty from '@/utils/dirEmpty';
import getDirectoryFiles from '@/utils/getDirectoryFiles';
import getRootDir from '@/utils/getRootDir';
import fs from 'fs';
import mustache from 'mustache';
import { parseArgs } from 'node:util';
import path from 'path';
import {
  promptAuthor,
  promptAuthorHandle,
  promptConfirm,
  promptDescription,
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
import { ProjectTemplateVars } from './types';

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
      throw new Error(
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
      throw new Error(
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
 * @param srcDir The path of the template files
 * @param destDir The path to render to
 * @param vars The mustache template variables
 */
async function renderFiles(
  srcDir: string,
  destDir: string,
  vars: ProjectTemplateVars,
) {
  const files = getDirectoryFiles(srcDir);

  files.forEach((fileName) => {
    const isRenderableMustache = fileName.endsWith('.mustache');

    const srcPath = path.join(srcDir, fileName);
    const destPath = getDestPath(destDir, fileName, isRenderableMustache, vars);

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
  const wpData = await getWordpressData();

  const installPath = args.positionals[1];

  if (!installPath) {
    throw new Error(`Install path required.`);
  }

  if (fs.existsSync(installPath) && !dirEmpty(installPath)) {
    throw new Error(`Installation directory must be empty '${installPath}'`);
  }

  const type = await promptProjectType();
  const title = await promptTitle();
  const author = await promptAuthor();
  const authorHandle = await promptAuthorHandle(author);
  const description = await promptDescription();
  const slug = await promptSlug(title);
  const prefix = await promptPrefix(title);
  const version = await promptVersion();
  const phpNamespace = await promptPhpNamespace(title);
  const wordpressVersion = await promptWordpressVersion(
    wpData.wordpressVersion,
  );
  const phpVersion = await promptPhpVersion(wpData.phpVersion);
  const installTests = await promptInstallTests();

  const [major, minor] = wordpressVersion.split('.');

  const templateVars: ProjectTemplateVars = {
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
    installPath,
    installTests,
    wpContentLocation: type === 'plugin' ? 'plugins' : 'themes',
  };

  await promptConfirm(templateVars);

  // Render base files
  renderFiles(
    getRootDir('templates', 'createProject', 'base'),
    installPath,
    templateVars,
  );

  // Render template specific files
  renderFiles(
    getRootDir('templates', 'createProject', type),
    installPath,
    templateVars,
  );

  // Render tests if needed
  if (installTests) {
    renderFiles(
      getRootDir('templates', 'createProject', 'tests'),
      installPath,
      templateVars,
    );
  }

  const entryFileName = type === 'plugin' ? `${slug}.php` : 'style.css';

  console.log(`
  Finished!
  Go to readme.txt and ${entryFileName} to fill in any more relevant information.
  `);
}
