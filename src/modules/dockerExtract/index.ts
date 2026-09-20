import { dockerExtractArgsConfig, showCmdHelp } from '@/args';
import { argOrPrompt } from '@/utils/argOrPrompt';
import ensureDir from '@/utils/ensureDir';
import normalizePath from '@/utils/normalizePath';
import { promptDir, promptString } from '@/utils/prompts';
import { isString } from '@/utils/typeChecks';
import { execSync } from 'child_process';
import { parseArgs } from 'util';

/**
 * Copys from a docker container wp-content to host machine
 */
export default async function dockerExtract() {
  const args = parseArgs(dockerExtractArgsConfig);

  if (args.values.help) {
    showCmdHelp(dockerExtractArgsConfig);
    return;
  }

  const container = await argOrPrompt(
    args.values.container,
    promptString('Docker container name.'),
    isString,
  );
  const src = await argOrPrompt(
    args.values.src,
    promptString(
      'Container wp-content location. Example "themes/my-awesome-thing".',
    ),
    isString,
  );
  const dest = await argOrPrompt(
    normalizePath(args.values.dest),
    promptDir('Local pc destination location.'),
    isString,
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
