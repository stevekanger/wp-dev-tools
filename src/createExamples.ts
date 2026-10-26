import fs from 'fs';
import { ProjectType } from './modules/createProject/types';
import { BlockType } from './modules/createBlock/types';
import getRootDir from './utils/getRootDir';
import { INITIAL_VERSION } from './constants';

type ExampleProject<T> = T[];

interface ExampleBlock {
  dest: string;
  type: BlockType;
  title: string;
  slug: string;
  namespace: string;
  textdomain: string;
  description: string;
  version: string;
}

interface ExamplePlugin {
  dest: string;
  type: ProjectType;
  title: string;
  author: string;
  authorHandle: string;
  description: string;
  slug: string;
  prefix: string;
  version: string;
  phpNamespace: string;
  wordpressVersion: string;
  phpVersion: string;
  installPhpSuite: boolean;
  installTests: boolean;
}

const examples: ExampleProject<ExamplePlugin | ExampleBlock> = [
  // plugin examples
  {
    dest: getRootDir('examples', 'plugin-base'),
    type: 'plugin',
    title: 'Plugin Base',
    author: 'John Doe',
    authorHandle: 'johndoe',
    description: 'Plugin base.',
    slug: 'plugin-base',
    prefix: 'plugin_base',
    version: INITIAL_VERSION,
    phpNamespace: 'PluginBase',
    wordpressVersion: '7.0',
    phpVersion: '8.3',
    installPhpSuite: false,
    installTests: false,
  },
  {
    dest: getRootDir('examples', 'plugin-with-tests'),
    type: 'plugin',
    title: 'Plugin With Tests',
    author: 'John Doe',
    authorHandle: 'johndoe',
    description: 'Plugin with tests.',
    slug: 'plugin-with-tests',
    prefix: 'plugin_with_tests',
    version: INITIAL_VERSION,
    phpNamespace: 'PluginWithTests',
    wordpressVersion: '7.0',
    phpVersion: '8.3',
    installPhpSuite: false,
    installTests: true,
  },
  {
    dest: getRootDir('examples', 'plugin-with-php'),
    type: 'plugin',
    title: 'Plugin With Php',
    author: 'John Doe',
    authorHandle: 'johndoe',
    description: 'Plugin with php.',
    slug: 'plugin-with-php',
    prefix: 'plugin_with_php',
    version: INITIAL_VERSION,
    phpNamespace: 'PluginWithPhp',
    wordpressVersion: '7.0',
    phpVersion: '8.3',
    installPhpSuite: false,
    installTests: true,
  },
  {
    dest: getRootDir('examples', 'plugin-with-tests-php'),
    type: 'plugin',
    title: 'Plugin With Tests Php',
    author: 'John Doe',
    authorHandle: 'johndoe',
    description: 'Plugin with tests and php.',
    slug: 'plugin-with-tests-php',
    prefix: 'plugin_with_tests_php',
    version: INITIAL_VERSION,
    phpNamespace: 'PluginWithTestsPhp',
    wordpressVersion: '7.0',
    phpVersion: '8.3',
    installPhpSuite: true,
    installTests: true,
  },
];

async function createExamples() { }

createExamples();
