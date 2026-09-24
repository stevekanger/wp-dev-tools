import { createBlockArgsConfig, showCmdHelp } from '@/args';
import { INITIAL_VERSION } from '@/constants';
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
import {
  promptConfirm,
  promptDir,
  promptString,
  promptValues,
} from '@/utils/prompts';
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
  const version = await argOrPrompt(
    args.values.version,
    promptString('Version.', INITIAL_VERSION),
    isString,
  );
  const dest = await argOrPrompt(
    normalizePath(args.values.dest),
    promptDir('Destination location.', `./src/blocks/${slug}`),
    isString,
  );

  if (fs.existsSync(dest) && !dirEmpty(dest)) {
    throw new UserError(`Installation directory must be empty '${dest}'`);
  }

  const confirmed = await promptConfirm({
    ['Type']: type,
    ['Title']: title,
    ['Slug']: slug,
    ['Namespace']: namespace,
    ['Textdomain']: textdomain,
    ['Description']: description,
    ['Version']: version,
    ['Destination']: dest,
  });

  if (!confirmed) {
    throw new UserError('Data not confirmed.');
  }

  const templateVars: BlockTemplateVars = {
    dest,
    type,
    title,
    slug,
    namespace,
    textdomain,
    description,
    version,
    isStaticVariant: type === 'static',
    isDynamicVariant: type === 'dynamic',
  };

  const src = getRootDir('templates', 'block');

  fs.readdirSync(src).forEach((item) => {
    const srcItemPath = path.join(src, item);
    const destItemPath = path.join(dest, removeMustacheExtension(item));

    if (isMustache(srcItemPath)) {
      renderMustache(srcItemPath, destItemPath, templateVars);
    }
  });

  console.log(`
===============
== Finished! ==
===============

Go to block.json and edit your block information.
Remember to register and build your block before use.
`);
}
