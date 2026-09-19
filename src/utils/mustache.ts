import fs from 'fs';
import mustache from 'mustache';
import path from 'path';

/**
 * Checks whether a file path is a mustache file
 *
 * @param src The source file path
 */
export function isMustache(src: string) {
  return src.endsWith('.mustache');
}

/**
 * Remove the mustache extension from the end of a file path string
 *
 * @param src The source file path
 */
export function removeMustacheExtension(src: string): string {
  if (isMustache(src)) {
    return src.slice(0, -'.mustache'.length);
  }

  return src;
}

/**
 * Renders a mustache file to the destination location
 *
 * @param src The path to the source template file
 * @param dest The destination path for the rendered file
 * @param vars The template variables
 */
export function renderMustache(src: string, dest: string, vars: any) {
  const fileContents = fs.readFileSync(src, 'utf8');
  const rendered = mustache.render(fileContents, vars);

  if (rendered) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, rendered, 'utf8');
  }
}
