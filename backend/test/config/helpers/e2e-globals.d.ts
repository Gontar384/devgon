import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Augments the NodeJS Global interface with values set during e2e globalSetup.
 * This eliminates all `(global as any).__X__` unsafe casts throughout the test suite.
 */
declare global {
  var __ADMIN_COOKIE__: string;
  var __ADMIN_USER_ID__: string;
  var __E2E_APP__: INestApplication;
  var __E2E_DATA_SOURCE__: DataSource;
}

export {};
