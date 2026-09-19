import archive from '@/modules/archive';
import copy from '@/modules/copy';
import createBlock from '@/modules/createBlock';
import createProject from '@/modules/createProject';
import dockerExtract from '@/modules/dockerExtract';
import UserError from '@/utils/UserError';
import { argConfigs, showCmdsHelp } from './args';

/**
 * Main function parses the first positional arg to find which command to run
 */
async function main() {
  try {
    const cmd = process.argv[2];

    switch (cmd) {
      case '-h':
        showCmdsHelp(argConfigs);
        break;
      case '--help':
        showCmdsHelp(argConfigs);
        break;
      case 'createProject':
        await createProject();
        break;
      case 'createBlock':
        await createBlock();
        break;
      case 'archive':
        await archive();
        break;
      case 'copy':
        await copy();
        break;
      case 'dockerExtract':
        await dockerExtract();
        break;
      default:
        showCmdsHelp(argConfigs);
        console.log(
          `\nUnsupported command '${cmd}'. Help shown above for commands and command structure.`,
        );
    }
  } catch (err) {
    if (err instanceof UserError) {
      console.log('Aborted: ', err.message);
    } else {
      console.log(err);
    }
  }
}

// Run the main function
main();
