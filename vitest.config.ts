import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['lib/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'lib/**',
        'tests/**',
        'vitest.config.ts',
        'src/index.ts',
        'src/server.ts',
        'src/config/**',
        'src/app/app-dependencies.ts',
        'src/app/create-app.ts',
        'src/modules/**/domain/**',
        'src/modules/**/presentation/*.routes.ts',
      ],
    },
  },
});
