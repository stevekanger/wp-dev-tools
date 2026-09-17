export const createProjectArgsConfig = {
  options: {
    title: { type: 'string' },
    author: { type: 'string' },
    authorHandle: { type: 'string' },
    description: { type: 'string' },
    slug: { type: 'string' },
    prefix: { type: 'string' },
    phpNamespace: { type: 'string' },
    version: { type: 'string' },
    wordpressVersion: { type: 'string' },
    phpVersion: { type: 'string' },
    installTests: { type: 'boolean' },
  },
  allowPositionals: true,
} as const;
