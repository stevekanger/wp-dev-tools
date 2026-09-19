import { createBlockArgsConfig, showCmdHelp } from '@/args';
import { argOrPrompt } from '@/utils/argOrPrompt';
import dirEmpty from '@/utils/dirEmpty';
import getEnv from '@/utils/getEnv';
import getRootDir from '@/utils/getRootDir';
import {
  isMustache,
  removeMustacheExtension,
  renderMustache,
} from '@/utils/mustache';
import normalizePath from '@/utils/normalizePath';
import { promptDir, promptString, promptValues } from '@/utils/prompts';
import { kebabCase, uppercaseFirstOnly } from '@/utils/strings';
import { isOneOf, isString } from '@/utils/typeChecks';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { BlockTemplateVars, BlockType } from './types';

/**
 * Creates wordpress block files
 */
export default async function createBlock() {
  const args = parseArgs(createBlockArgsConfig);

  if (args.values.help) {
    showCmdHelp(createBlockArgsConfig);
    return;
  }

  const type: BlockType = await argOrPrompt(
    args.values.type,
    promptValues('Block type.', ['static', 'dynamic'] as const),
    isOneOf('static', 'dynamic'),
  );
  const title = await argOrPrompt(
    args.values.title,
    promptString('Title. Example "My Awesome Thing".'),
    isString,
  );
  const slug = await argOrPrompt(
    args.values.slug,
    promptString('Slug. Example "my-awesome-thing".', kebabCase(title)),
    isString,
  );
  const namespace = await argOrPrompt(
    args.values.namespace,
    promptString('Namespace.', getEnv('SLUG', '')),
    isString,
  );
  const textdomain = await argOrPrompt(
    args.values.textdomain,
    promptString('Textdomain.', getEnv('SLUG', '')),
    isString,
  );
  const description = await argOrPrompt(
    args.values.description,
    promptString('Description.', uppercaseFirstOnly(title) + '.'),
    isString,
  );
  const dest = await argOrPrompt(
    normalizePath(args.values.dest || ''),
    promptDir('Destination location.', `./src/blocks/${slug}`),
    isString,
  );

  if (fs.existsSync(dest) && !dirEmpty(dest)) {
    throw new UserError(`Installation directory must be empty '${dest}'`);
  }

  const templateVars: BlockTemplateVars = {
    dest,
    type,
    title,
    slug,
    namespace,
    textdomain,
    description,
    isStaticVariant: type === 'static',
    isDynamicVariant: type === 'dynamic',
  };

  const src = getRootDir('templates', 'createBlock');

  fs.readdirSync(src).forEach((item) => {
    const srcItemPath = path.join(src, item);
    const destItemPath = path.join(dest, removeMustacheExtension(item));

    if (isMustache(srcItemPath)) {
      renderMustache(srcItemPath, destItemPath, templateVars);
    }
  });

  console.log(
    `\nFinished! Go to block.json and edit your block information. Don't forget to build and register your block before use.`,
  );
}
