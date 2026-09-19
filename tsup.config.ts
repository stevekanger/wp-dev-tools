import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs'],
  clean: true,
  dts: false,
  sourcemap: true,
  minify: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
