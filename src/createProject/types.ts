export type ProjectType = 'plugin' | 'theme';
export type ProjectTypeProper = 'Plugin' | 'Theme';
export type WpContentLocation = 'plugins' | 'themes';

export interface ProjectTemplateVars {
  type: ProjectType;
  typeProper: ProjectTypeProper;
  isPlugin: boolean;
  isTheme: boolean;
  title: string;
  author: string;
  authorHandle: string;
  description: string;
  slug: string;
  prefix: string;
  version: string;
  phpNamespace: string;
  wordpressVersion: string;
  wordpressVersionMajorMinor: string;
  phpVersion: string;
  installPath: string;
  installTests: boolean;
  wpContentLocation: WpContentLocation;
}
