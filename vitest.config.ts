import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)), 'next/server': 'vinext/shims/server' } },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
