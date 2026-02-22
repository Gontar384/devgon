import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../.',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  globalSetup: '<rootDir>/config/setup/jest.global-setup.e2e.ts',
  globalTeardown: '<rootDir>/config/setup/jest.global-teardown.e2e.ts',
  testEnvironment: 'node',
  testTimeout: 30000,
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
  maxWorkers: 1,
};

export default config;
