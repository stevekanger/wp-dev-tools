import { ArgConfig } from './types';

/**
 * Arg config for createProject module
 */
export const createProjectArgsConfig = {
  cmd: 'createProject',
  options: {
    dest: {
      type: 'string',
      description: 'The directory you want to install the project to.',
    },
    type: {
      type: 'string',
      description: 'The type of project to create. Allowed: "theme", "plugin".',
    },
    title: {
      type: 'string',
      description:
        'The proper title of your project. Example "My Awesome Project".',
    },
    author: {
      type: 'string',
      description: 'The authors full name. Example "John Doe".',
    },
    authorHandle: {
      type: 'string',
      description:
        'The authors handle. No spaces, kebab or snake case. Example "johndoe"',
    },
    description: {
      type: 'string',
      description: 'A short description of your project.',
    },
    slug: {
      type: 'string',
      description: 'The kebab case name. Example "my-awesome-project"',
    },
    prefix: {
      type: 'string',
      description: 'The snake case name. Example "my_awesome_project"',
    },
    version: {
      type: 'string',
      description: 'The initial version of your project.',
    },
    phpNamespace: {
      type: 'string',
      description: 'The namespace used for php files.',
    },
    wordpressVersion: {
      type: 'string',
      description: 'The minimum required Wordpress Version',
    },
    phpVersion: {
      type: 'string',
      description: 'The minimum required Php Version',
    },
    installTests: {
      type: 'boolean',
      description: 'Whether or not to install tests',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

/**
 * Arg config for the createBlock module
 */
export const createBlockArgsConfig = {
  cmd: 'createBlock',
  options: {
    dest: {
      type: 'string',
      description: 'The directory to place the block files.',
    },
    type: {
      type: 'string',
      description: 'The type of block. Allowed "static", "dynamic".',
    },
    title: {
      type: 'string',
      description: 'Proper title of your block. Example "My Awesome Block".',
    },
    slug: {
      type: 'string',
      description:
        'Used for block name and block folder. Kebab case. Example "my-awesome-block".',
    },
    namespace: {
      type: 'string',
      description:
        'The block namespace. Usually kebab case. Example "my-awesome-project".',
    },
    textdomain: {
      type: 'string',
      description:
        'The block namespace. Usually kebab case and can match namespace. Example "my-awesome-project".',
    },
    description: {
      type: 'string',
      description: 'A brief description of your block.',
    },
    version: {
      type: 'string',
      description: 'Initial version of your block.',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

/**
 * Arg config for the archive module
 */
export const archiveArgsConfig = {
  cmd: 'archive',
  options: {
    type: {
      type: 'string',
      description: 'Which files to be included. Allowed: "dist", "dev"',
    },
    src: {
      type: 'string',
      description: 'The directory path to the input files.',
    },
    dest: {
      type: 'string',
      description: 'The directory path where the archive will be placed.',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

/**
 * Arg config for the copy module
 */
export const copyArgsConfig = {
  cmd: 'copy',
  options: {
    type: {
      type: 'string',
      description: 'Which files to be included. Allowed: "dist", "dev"',
    },
    src: {
      type: 'string',
      description: 'The directory path to the input files.',
    },
    dest: {
      type: 'string',
      description: 'The directory path where the files will be placed.',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

/**
 * Arg config for the dockerExtract module
 */
export const dockerExtractArgsConfig = {
  cmd: 'dockerExtract',
  options: {
    container: {
      type: 'string',
      description: 'The name of the docker container.',
    },
    src: {
      type: 'string',
      description:
        'The source files relative to wp-content in the docker container. Example "themes/my-awesome-theme"',
    },
    dest: {
      type: 'string',
      description: 'The directory path where the files will be placed.',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

/**
 * Arg configs for all modules
 */
export const argConfigs: ArgConfig[] = [
  createProjectArgsConfig,
  archiveArgsConfig,
  copyArgsConfig,
  dockerExtractArgsConfig,
  createBlockArgsConfig,
];

/**
 * Shows a specific command help message
 *
 * @param config The parseArg config
 */
export function showCmdHelp(config: ArgConfig) {
  console.log(`\n[${config.cmd}]`);
  Object.keys(config.options).forEach((key) => {
    const item = config.options[key];
    const short = item.short ? `-${item.short}` : '';

    const description = `--${key} ${short}
  type: ${item.type}
  description: ${item.description}`;

    console.log(description);
  });
}

/**
 * Shows multiple commands help
 *
 * @param configs An array of parseArg configs
 */
export function showCmdsHelp(configs: ArgConfig[]) {
  console.log(
    'Run command first followed by any options.\nStructure: [command] ...options',
  );
  console.log('\n[--help] [-h]\nShows the help message.');

  configs.forEach((config) => {
    showCmdHelp(config);
  });
}
