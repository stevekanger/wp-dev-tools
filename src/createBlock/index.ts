import { createBlockArgsConfig, showCmdHelp } from '@/args';
import { argOrPrompt } from '@/utils/argOrPrompt';
import dirEmpty from '@/utils/dirEmpty';
import getRootDir from '@/utils/getRootDir';
import {
  isMustache,
  removeMustacheExtension,
  renderMustache,
} from '@/utils/mustache';
import { isString } from '@/utils/typeChecks';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import {
  promptDescription,
  promptDest,
  promptNamespace,
  promptSlug,
  promptTextDomain,
  promptTitle,
  promptType,
} from './prompts';
import { BlockTemplateVars } from './types';

/**
 * Creates wordpress block files
 */
export default async function createBlock() {
  const args = parseArgs(createBlockArgsConfig);

  if (args.values.help) {
    showCmdHelp(createBlockArgsConfig);
    return;
  }

  const type = await argOrPrompt(
    args.values.type,
    promptType,
    (arg) => arg === 'static' || arg === 'dynamic',
  );

  const title = await argOrPrompt(args.values.title, promptTitle, isString);
  const slug = await argOrPrompt(args.values.slug, promptSlug(title), isString);
  const namespace = await argOrPrompt(
    args.values.namespace,
    promptNamespace,
    isString,
  );
  const textdomain = await argOrPrompt(
    args.values.textdomain,
    promptTextDomain,
    isString,
  );
  const description = await argOrPrompt(
    args.values.description,
    promptDescription(title),
    isString,
  );
  const dest = path.resolve(
    await argOrPrompt(args.values.dest, promptDest(slug), isString),
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
