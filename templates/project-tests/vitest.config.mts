import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: './tests/js',
    globals: true,
  },
});
