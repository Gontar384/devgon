import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

export interface E2EContext {
  app: INestApplication;
  dataSource: DataSource;
}

function getAdminCookie(): string {
  const cookie = process.env['E2E_ADMIN_COOKIE'];
  if (!cookie) {
    throw new Error(
      'E2E_ADMIN_COOKIE is not set. ' +
        'Make sure jest.e2e.config.ts points to globalSetup.',
    );
  }
  return cookie;
}

/**
 * Reuses the single NestJS app instance created in globalSetup.
 *
 * WHY reuse instead of creating a new instance:
 * With --runInBand, globalSetup runs in the same process as the tests.
 * NestJS GraphQL uses reflect-metadata decorators which are global singletons.
 * Creating a second app instance in the same process causes
 * "Cannot determine a GraphQL output type" because the decorator registry
 * gets corrupted by double-registration.
 *
 * globalSetup stores the app on global.__E2E_APP__ and the DataSource
 * on global.__E2E_DATA_SOURCE__ for reuse here.
 */
export function bootstrapTestApp(): E2EContext {
  const app = global.__E2E_APP__;
  const dataSource = global.__E2E_DATA_SOURCE__;

  if (!app || !dataSource) {
    throw new Error(
      'global.__E2E_APP__ or __E2E_DATA_SOURCE__ is not set. ' +
        'Make sure jest.e2e.config.ts points to the correct globalSetup file.',
    );
  }

  return { app, dataSource };
}

/** Sends an unauthenticated GraphQL request. */
export const gql = (
  app: INestApplication,
  query: string,
  variables?: object,
): request.Test =>
  request(app.getHttpServer() as Parameters<typeof request>[0])
    .post('/api/graphql')
    .send({ query, variables });

/** Sends a GraphQL request with the admin cookie from globalSetup. */
export const gqlAsAdmin = (
  app: INestApplication,
  query: string,
  variables?: object,
): request.Test =>
  request(app.getHttpServer() as Parameters<typeof request>[0])
    .post('/api/graphql')
    .set('Cookie', getAdminCookie())
    .send({ query, variables });

/** Returns the admin cookie string for use in manual supertest builders. */
export const adminCookie = (): string => getAdminCookie();
