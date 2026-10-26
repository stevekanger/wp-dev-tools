import fs from 'fs';
import path from 'path';
import getDirectoryFiles from './getDirectoryFiles';
import {
  isMustache,
  removeMustacheExtension,
  renderMustache,
} from './mustache';
import replaceFilenamePlaceholders from './replaceFilenamePlaceholder';

/**
 * Render template files from directory
 *
 * @param src - The directory of the template files
 * @param dest - The directory to render to
 * @param templateVars - The mustache template variables
 * @param placeholders - Filename placeholders to replace
 */
export default function renderTemplateDirectory(
  src: string,
  dest: string,
  templateVars: Record<string, any>,
  placeholders = {},
) {
  getDirectoryFiles(src).forEach((fileName) => {
    const srcPath = path.join(src, fileName);

    let destPath = path.join(
      dest,
      removeMustacheExtension(
        replaceFilenamePlaceholders(fileName, placeholders),
      ),
    );

    if (isMustache(fileName)) {
      renderMustache(srcPath, destPath, templateVars);
    } else {
      fs.cpSync(srcPath, destPath);
    }
  });
}
