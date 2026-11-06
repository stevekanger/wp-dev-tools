import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: 'dist',
  minify: true,
  clean: true,
  dts: false,
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
