import archive from './archive';
import copy from './copy';
import createBlock from './createBlock';
import createProject from './createProject';
import dockerExtract from './dockerExtract';

/**
 * Main function parses the first positional arg to find which command to run
 */
async function main() {
  try {
    const cmd = process.argv[2];

    switch (cmd) {
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
        throw new Error(`Unsupported command '${cmd}'`);
    }
  } catch (err) {
    console.log(err);
  }
}

// Run the main function
main();
