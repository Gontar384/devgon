import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../../src/app.module';
import { UserRole } from '../../../../src/modules/auth/auth.types';
import { AUTH_POLICY } from '../../../../src/modules/auth/auth.policy';

/**
 * Runs once before the entire e2e suite.
 *
 * Boots the full NestJS app, upserts an admin user, signs a JWT,
 * and verifies the cookie against /auth/verify. Stores the resulting
 * app instance and cookie on `global.*` (visible in tests via --runInBand)
 * and on `process.env` as a fallback.
 */
export default async function globalSetup(): Promise<void> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.init();

  Logger.prototype.error = () => undefined;

  const dataSource = app.get(DataSource);
  const jwtService = app.get(JwtService);

  const adminUser = await dataSource.query<Array<{ id: string }>>(
    `INSERT INTO "user" (email, username, role)
     VALUES ('admin@test.com', 'testadmin', $1) ON CONFLICT (email) DO
    UPDATE SET role = $1
      RETURNING id`,
    [UserRole.ADMIN],
  );

  const adminId = adminUser[0].id;

  const accessToken = jwtService.sign(
    { userId: adminId, email: 'admin@test.com', role: UserRole.ADMIN },
    { expiresIn: AUTH_POLICY.tokens.access.jwtExpiry },
  );

  const cookieHeader = `${AUTH_POLICY.cookies.access.name}=${accessToken}`;

  const res = await request(
    app.getHttpServer() as Parameters<typeof request>[0],
  )
    .get('/api/auth/verify')
    .set('Cookie', cookieHeader);

  if (res.status !== 200) {
    throw new Error(
      `Auth setup failed — /auth/verify returned ${res.status}: ${JSON.stringify(res.body)}`,
    );
  }

  // With --runInBand, globalSetup runs in the same process as tests
  global.__E2E_APP__ = app;
  global.__E2E_DATA_SOURCE__ = dataSource;
  global.__ADMIN_COOKIE__ = cookieHeader;
  global.__ADMIN_USER_ID__ = adminId;
  process.env['E2E_ADMIN_COOKIE'] = cookieHeader; // Fallback
  process.env['E2E_ADMIN_USER_ID'] = adminId;
}
