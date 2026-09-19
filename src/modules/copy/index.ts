import { copyArgsConfig, showCmdHelp } from '@/args';
import { DevToolsJson } from '@/types';
import { argOrPrompt } from '@/utils/argOrPrompt';
import ensureDir from '@/utils/ensureDir';
import getJsonFileContents from '@/utils/getJsonFileContents';
import normalizePath from '@/utils/normalizePath';
import { promptDir, promptValues } from '@/utils/prompts';
import { isOneOf, isString } from '@/utils/typeChecks';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { CopyType } from './types';

/**
 * Copy the project files to specified directory
 */
export default async function copy() {
  const args = parseArgs(copyArgsConfig);

  if (args.values.help) {
    showCmdHelp(copyArgsConfig);

    return;
  }

  const src = await argOrPrompt(
    args.values.src,
    promptDir('Source location.'),
    isString,
  );
  const dest = await argOrPrompt(
    normalizePath(args.values.dest),
    promptDir('Destination location.'),
    isString,
  );
  const type: CopyType = await argOrPrompt(
    args.values.type,
    promptValues('Copy type.', ['dist', 'dev'] as const),
    isOneOf('dist', 'dev'),
  );

  const devToolsJson = getJsonFileContents<DevToolsJson>(
    path.join(src, 'dev-tools.json'),
  );

  if (!devToolsJson) {
    throw new UserError('Could not find dev-tools.json in cwd.');
  }

  const {
    files: { dev: includedDev, dist: includedDist },
  } = devToolsJson;

  const includedItems = type === 'dist' ? includedDist : includedDev;

  ensureDir(dest);

  fs.readdirSync(src).forEach((item) => {
    item = item.toString();

    if (!includedItems.includes(item)) {
      return;
    }

    const inputItemPath = path.join(src, item);
    const outputItemPath = path.join(dest, item);

    fs.cpSync(inputItemPath, outputItemPath, { recursive: true });
  });

  console.log('finished.');
}
