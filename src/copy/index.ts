import { copyArgsConfig, showCmdHelp } from '@/args';
import { DevToolsJson } from '@/types';
import ensureDir from '@/utils/ensureDistDir';
import getJsonFileContents from '@/utils/getJsonFileContents';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { promptDest, promptSrc, promptType } from './prompts';
import { argOrPrompt } from '@/utils/argOrPrompt';
import { CopyType } from './types';
import { isString } from '@/utils/typeChecks';

/**
 * Copy the project files to specified directory
 */
export default async function copy() {
  const args = parseArgs(copyArgsConfig);

  if (args.values.help) {
    showCmdHelp(copyArgsConfig);

    return;
  }

  const src = await argOrPrompt(args.values.src, promptSrc, isString);
  const dest = path.resolve(
    await argOrPrompt(args.values.dest, promptDest, isString),
  );
  const type: CopyType = await argOrPrompt(
    args.values.type,
    promptType,
    (arg) => arg === 'dev' || arg === 'dist',
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
