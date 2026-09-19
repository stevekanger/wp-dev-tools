export interface DevToolsJson {
  main: string;
  files: {
    dist: string[];
    dev: string[];
  };
}

export interface ArgOption {
  type: 'string' | 'boolean';
  description: string;
  short?: string;
}

export interface ArgConfig {
  cmd: string;
  options: Record<string, ArgOption>;
  allowPositionals: boolean;
}

export type ArgValidator<T> = (arg: unknown) => arg is T;
