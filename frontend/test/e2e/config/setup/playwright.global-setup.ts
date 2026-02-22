import { chromium } from '@playwright/test';
import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { ADMIN_STORAGE_STATE } from '../fixtures/fixtures';

/**
 * Playwright global setup — bypasses Google OAuth entirely.
 *
 * Runs in a separate process from the test workers, but playwright.config.ts
 * loads .env.test via dotenv before spawning this, so process.env is populated.
 *
 * Steps:
 *   1. Connect to the test DB and upsert an admin user.
 *   2. Sign a JWT access token (same payload shape as AuthService).
 *   3. Inject the cookie into a browser context.
 *   4. Verify against /api/auth/verify (proxied through Next.js → backend).
 *   5. Save storage state for reuse across all test workers.
 */

const ACCESS_COOKIE_NAME = 'access_token';

export default async function globalSetup(): Promise<void> {
  const BASE_URL = process.env['NEXT_PUBLIC_BACKEND_URL'];
  const JWT_SECRET = process.env['JWT_SECRET_KEY'];
  const connectionString = process.env['DATABASE_URL'];

  if (!BASE_URL) {
    throw new Error('BASE_URL is not set.');
  } else if (!JWT_SECRET) {
    throw new Error('JWT_SECRET_KEY is not set.');
  } else if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  const db = new Client({ connectionString });
  await db.connect();

  const { rows } = await db.query<{ id: string }>(
    `INSERT INTO "user" (email, username, role)
     VALUES ($1, $2, $3) ON CONFLICT (email) DO
    UPDATE SET role = EXCLUDED.role
      RETURNING id`,
    ['playwright-admin@test.com', 'playwright-admin', 'admin'],
  );
  const adminId = rows[0].id;

  await db.end();

  const payload = {
    userId: adminId,
    email: 'playwright-admin@test.com',
    role: 'admin',
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  fs.mkdirSync(path.dirname(ADMIN_STORAGE_STATE), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: BASE_URL });

  await context.addCookies([
    {
      name: ACCESS_COOKIE_NAME,
      value: accessToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  const page = await context.newPage();
  const res = await page.request.get(`${BASE_URL}/api/auth/verify`);

  if (res.status() !== 200) {
    const body = await res.text();
    throw new Error(
      `Auth cookie verification failed — /api/auth/verify returned ${res.status()}: ${body}`,
    );
  }

  await page.close();
  await context.storageState({ path: ADMIN_STORAGE_STATE });
  await browser.close();

  console.log(`✅ Admin session saved → ${ADMIN_STORAGE_STATE}`);
}
