import { dockerExtractArgsConfig, showCmdHelp } from '@/args';
import ensureDir from '@/utils/ensureDistDir';
import { execSync } from 'child_process';
import { parseArgs } from 'util';
import { promptContainer, promptDest, promptSrc } from './prompts';
import path from 'path';

export default async function dockerExtract() {
  const args = parseArgs(dockerExtractArgsConfig);

  if (args.values.help) {
    showCmdHelp(dockerExtractArgsConfig);
    return;
  }

  const container = args.values.container
    ? args.values.container
    : await promptContainer();
  const src = args.values.src ? args.values.src : await promptSrc();
  const dest = args.values.dest
    ? path.resolve(args.values.dest)
    : path.resolve(await promptDest());

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
