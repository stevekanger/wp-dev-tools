import { ArgConfig } from './types';

export const createProjectArgsConfig = {
  cmd: 'createProject',
  options: {
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

export const archiveArgsConfig = {
  cmd: 'archive',
  options: {
    src: {
      type: 'string',
      description: 'The directory path to the input files.',
      short: 's',
    },
    dest: {
      type: 'string',
      description: 'The directory path where the archive will be placed.',
      short: 'd',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

export const copyArgsConfig = {
  cmd: 'copy',
  options: {
    src: {
      type: 'string',
      description: 'The directory path to the input files.',
      short: 's',
    },
    dest: {
      type: 'string',
      description: 'The directory path where the files will be placed.',
      short: 'd',
    },
    help: {
      type: 'boolean',
      description: 'Shows the help message.',
      short: 'h',
    },
  },
  allowPositionals: true,
} as const;

export const argConfigs: ArgConfig[] = [
  createProjectArgsConfig,
  archiveArgsConfig,
  copyArgsConfig,
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
    const msg = `--${key} -${item.short}
  type: ${item.type}
  description: ${item.description}`;

    console.log(msg);
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

  configs.forEach((config) => {
    showCmdHelp(config);
  });
}
