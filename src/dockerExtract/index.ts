import { dockerExtractArgsConfig, showCmdHelp } from '@/args';
import ensureDir from '@/utils/ensureDistDir';
import { execSync } from 'child_process';
import { parseArgs } from 'util';
import { promptContainer, promptDest, promptSrc } from './prompts';
import path from 'path';
import { argOrPrompt } from '@/utils/argOrPrompt';
import { isString } from '@/utils/typeChecks';

export default async function dockerExtract() {
  const args = parseArgs(dockerExtractArgsConfig);

  if (args.values.help) {
    showCmdHelp(dockerExtractArgsConfig);
    return;
  }

  const container = await argOrPrompt(
    args.values.container,
    promptContainer,
    isString,
  );
  const src = path.resolve(
    await argOrPrompt(args.values.src, promptSrc, isString),
  );
  const dest = path.resolve(
    await argOrPrompt(args.values.dest, promptDest, isString),
  );

  ensureDir(dest);

  const msg = execSync(
    `docker cp ${container}:/var/www/html/wp-content/${src} ${dest}`,
  )
    .toString()
    .trim();

  if (msg) {
    console.log(msg);
  } else {
    console.log('Resource extracted!');
  }
}
