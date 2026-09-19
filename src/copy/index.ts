import { copyArgsConfig, showCmdHelp } from '@/args';
import { DevToolsJson } from '@/types';
import ensureDir from '@/utils/ensureDistDir';
import getJsonFileContents from '@/utils/getJsonFileContents';
import UserError from '@/utils/UserError';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { promptDest, promptSrc, promptType } from './prompts';

/**
 * Copy the project files to specified directory
 */
export default async function copy() {
  const args = parseArgs(copyArgsConfig);

  if (args.values.help) {
    showCmdHelp(copyArgsConfig);

    return;
  }

  const src = args.values.src
    ? path.resolve(args.values.src)
    : path.resolve(await promptSrc());

  const dest = args.values.dest
    ? path.resolve(args.values.dest)
    : path.resolve(await promptDest());

  const devToolsJson = getJsonFileContents<DevToolsJson>(
    path.join(src, 'dev-tools.json'),
  );

  if (!devToolsJson) {
    throw new UserError('Could not find dev-tools.json in cwd.');
  }

  const {
    files: { dev: includedDev, dist: includedDist },
  } = devToolsJson;

  ensureDir(dest);

  const type = await promptType();
  const includedItems = type === 'dist' ? includedDist : includedDev;

  fs.readdirSync(src, { recursive: true }).forEach((item) => {
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
