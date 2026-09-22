export type BlockType = 'static' | 'dynamic';

export interface BlockTemplateVars {
  dest: string;
  type: BlockType;
  slug: string;
  namespace: string;
  textdomain: string;
  title: string;
  description: string;
  version: string;
  isStaticVariant: boolean;
  isDynamicVariant: boolean;
}
