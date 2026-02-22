import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ADMIN_STORAGE_STATE } from './fixtures/fixtures';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

export default defineConfig({
  testDir: '../.',
  outputDir: '../test-results',
  timeout: 30_000,
  globalSetup: './setup/playwright.global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    storageState: ADMIN_STORAGE_STATE,
  },

  projects: [
    {
      name: 'e2e',
      testMatch: /.*\.e2e-spec\.ts$/,
    },
  ],
});
