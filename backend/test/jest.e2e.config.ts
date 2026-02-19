import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/e2e/.+\\.e2e-spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  globalSetup: '<rootDir>/config/helpers/jest.global-setup.e2e.ts',
  globalTeardown: '<rootDir>/config/helpers/jest.global-teardown.e2e.ts',
  testEnvironment: 'node',
  testTimeout: 30000,
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
  maxWorkers: 1,
};

export default config;
