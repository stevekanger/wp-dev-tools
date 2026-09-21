export type ProjectType = 'plugin' | 'theme';
export type WpContentLocation = 'plugins' | 'themes';

export interface ProjectTemplateVars {
  dest: string;
  type: ProjectType;
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
  installTests: boolean;
  wpContentLocation: WpContentLocation;
  devToolsVersion: string;
}
