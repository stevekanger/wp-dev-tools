import fs from 'fs';
import packageJson from '../package.json';
import { INITIAL_VERSION } from './constants';
import { BlockTemplateVars } from './modules/createBlock/types';
import { renderProjectFiles } from './modules/createProject';
import {
  ProjectTemplateVars,
  ProjectType,
  WpContentLocation,
} from './modules/createProject/types';
import getRootDir from './utils/getRootDir';
import getWpData from './utils/getWpData';
import renderTemplateDirectory from './utils/renderTemplateDirectory';

interface ExampleBlockVars extends BlockTemplateVars { }

interface ExampleProjectVars extends ProjectTemplateVars {
  dest: string;
}

/**
 * Get the plugin examples to render.
 */
function getProjectPluginExamples(
  wordpressVersion: string,
  phpVersion: string,
): ExampleProjectVars[] {
  const defaults = {
    type: 'plugin' as ProjectType,
    author: 'John Doe',
    authorHandle: 'johndoe',
    version: INITIAL_VERSION,
    wordpressVersion,
    phpVersion,
    devToolsVersion: packageJson.version,
    isPlugin: true,
    isTheme: false,
    wpContentLocation: 'plugins' as WpContentLocation,
  };

  return [
    {
      ...defaults,
      dest: getRootDir('examples', 'plugin-base'),
      title: 'Plugin Base',
      description: 'Plugin base.',
      slug: 'plugin-base',
      prefix: 'plugin_base',
      phpNamespace: 'PluginBase',
      installPhpSuite: false,
      installTests: false,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'plugin-with-tests'),
      title: 'Plugin With Tests',
      description: 'Plugin with tests.',
      slug: 'plugin-with-tests',
      prefix: 'plugin_with_tests',
      phpNamespace: 'PluginWithTests',
      installPhpSuite: false,
      installTests: true,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'plugin-with-php'),
      title: 'Plugin With Php',
      description: 'Plugin with php.',
      slug: 'plugin-with-php',
      prefix: 'plugin_with_php',
      phpNamespace: 'PluginWithPhp',
      installPhpSuite: true,
      installTests: false,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'plugin-with-tests-php'),
      title: 'Plugin With Tests Php',
      description: 'Plugin with tests and php.',
      slug: 'plugin-with-tests-php',
      prefix: 'plugin_with_tests_php',
      phpNamespace: 'PluginWithTestsPhp',
      installPhpSuite: true,
      installTests: true,
    },
  ];
}

/**
 * Get the theme examples to render.
 */
function getProjectThemeExamples(
  wordpressVersion: string,
  phpVersion: string,
): ExampleProjectVars[] {
  const defaults = {
    type: 'theme' as ProjectType,
    author: 'John Doe',
    authorHandle: 'johndoe',
    version: INITIAL_VERSION,
    wordpressVersion,
    phpVersion,
    devToolsVersion: packageJson.version,
    isPlugin: false,
    isTheme: true,
    wpContentLocation: 'themes' as WpContentLocation,
  };

  return [
    {
      ...defaults,
      dest: getRootDir('examples', 'theme-base'),
      title: 'Theme Base',
      description: 'Theme base.',
      slug: 'theme-base',
      prefix: 'theme_base',
      phpNamespace: 'ThemeBase',
      installPhpSuite: false,
      installTests: false,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'theme-with-tests'),
      title: 'Theme With Tests',
      description: 'Theme with tests.',
      slug: 'theme-with-tests',
      prefix: 'theme_with_tests',
      phpNamespace: 'ThemeWithTests',
      installPhpSuite: false,
      installTests: true,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'theme-with-php'),
      title: 'Theme With Php',
      description: 'Theme with php.',
      slug: 'theme-with-php',
      prefix: 'theme_with_php',
      phpNamespace: 'ThemeWithPhp',
      installPhpSuite: true,
      installTests: false,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'theme-with-tests-php'),
      title: 'Theme With Tests Php',
      description: 'Theme with tests and php.',
      slug: 'theme-with-tests-php',
      prefix: 'theme_with_tests_php',
      phpNamespace: 'ThemeWithTestsPhp',
      installPhpSuite: true,
      installTests: true,
    },
  ];
}

/**
 * Get the block examples to render.
 */
function getBlockExamples(): ExampleBlockVars[] {
  const defaults = {
    namespace: 'example-namespace',
    textdomain: 'example-textdomain',
    version: INITIAL_VERSION,
  };

  return [
    {
      ...defaults,
      dest: getRootDir('examples', 'block-static'),
      type: 'static',
      slug: 'block-static',
      title: 'Block Static',
      description: 'Block static.',
      isDynamicVariant: false,
      isStaticVariant: true,
    },
    {
      ...defaults,
      dest: getRootDir('examples', 'block-dynamic'),
      type: 'dynamic',
      slug: 'block-dynamic',
      title: 'Block Dynamic',
      description: 'Block dynamic.',
      isDynamicVariant: true,
      isStaticVariant: false,
    },
  ];
}

/**
 * Creates the block examples from template files.
 */
async function createExamples() {
  const { recommendedWpVersion, recommendedPhpVersion } = await getWpData();

  const projectExamples = [
    ...getProjectPluginExamples(recommendedWpVersion, recommendedPhpVersion),
    ...getProjectThemeExamples(recommendedWpVersion, recommendedPhpVersion),
  ];

  projectExamples.forEach((project) => {
    const { dest, type } = project;
    fs.rmSync(dest, { recursive: true, force: true });
    renderProjectFiles(dest, type, project);
  });

  getBlockExamples().forEach((block) => {
    const { dest } = block;

    fs.rmSync(dest, { recursive: true, force: true });
    renderTemplateDirectory(getRootDir('templates', 'block'), dest, block);
  });
}

// Run the script.
createExamples();
