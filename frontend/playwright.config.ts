import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  outputDir: './test/test-results',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run start:all',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /.*\.spec\.ts$/,
    },
  ],
});
