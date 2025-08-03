import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  outputDir: './test/test-results',
  timeout: 30_000,
  globalSetup: './test/e2e/test-util/playwright.global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /.*\.spec\.ts$/,
    },
  ],
});
