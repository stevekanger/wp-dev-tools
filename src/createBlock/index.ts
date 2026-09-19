import { createBlockArgsConfig, showCmdHelp } from '@/args';
import path from 'path';
import fs from 'fs';
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
import { BlockTemplateVars, BlockType } from './types';
import getRootDir from '@/utils/getRootDir';
import {
  isMustache,
  removeMustacheExtension,
  renderMustache,
} from '@/utils/mustache';
import dirEmpty from '@/utils/dirEmpty';
import UserError from '@/utils/UserError';

/**
 * Checks if user input is valid block type
 */
function isBlockType(type: unknown): type is BlockType {
  return type === 'static' || type === 'dynamic';
}

/**
 * Creates wordpress block files
 */
export default async function createBlock() {
  const args = parseArgs(createBlockArgsConfig);

  if (args.values.help) {
    showCmdHelp(createBlockArgsConfig);
    return;
  }

  const type = isBlockType(args.values.type)
    ? args.values.type
    : await promptType();

  const title = args.values.title ? args.values.title : await promptTitle();

  const slug = args.values.slug ? args.values.slug : await promptSlug(title);

  const namespace = args.values.namespace
    ? args.values.namespace
    : await promptNamespace();

  const textdomain = args.values.textdomain
    ? args.values.textdomain
    : await promptTextDomain();

  const description = args.values.description
    ? args.values.description
    : await promptDescription(title);

  const dest = args.values.dest
    ? path.resolve(args.values.dest)
    : path.resolve(await promptDest(slug));

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
