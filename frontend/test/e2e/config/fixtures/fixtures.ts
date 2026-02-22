/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { Client } from 'pg';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ADMIN_STORAGE_STATE = path.resolve(
  __dirname,
  '../data/admin.storageState.json',
);

export class DbHelper {
  constructor(private readonly client: Client) {}

  async query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const res = await this.client.query<T>(sql, params);
    return res.rows;
  }

  async insertContent(fields: {
    key: string;
    order: number;
    title?: string;
  }): Promise<string> {
    const rows = await this.query<{ id: string }>(
      `INSERT INTO "content" (key, "order", title)
       VALUES ($1, $2, $3) RETURNING id`,
      [fields.key, fields.order, fields.title ?? null],
    );
    return rows[0].id;
  }

  async getContentsByKey(
    key: string,
  ): Promise<Array<{ id: string; order: number; title: string | null }>> {
    return this.query(
      `SELECT id, "order", title
       FROM "content"
       WHERE key = $1
       ORDER BY "order" ASC`,
      [key],
    );
  }

  async getMediaForContent(
    contentId: string,
  ): Promise<
    Array<{ id: string; filename: string; uploadTempId: string | null }>
  > {
    return this.query(
      `SELECT id, filename, "uploadTempId"
       FROM "media"
       WHERE "contentId" = $1`,
      [contentId],
    );
  }

  async cleanup(): Promise<void> {
    await this.query('DELETE FROM "media"');
    await this.query('DELETE FROM "content"');
  }
}

interface ContentFixtures {
  adminContext: BrowserContext;
  adminPage: Page;
  db: DbHelper;
}

export const test = base.extend<ContentFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ADMIN_STORAGE_STATE,
    });
    await use(context);
    await context.close();
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
    await page.close();
  },

  db: async ({}, use) => {
    const connectionString = process.env['DATABASE_URL'];

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set.');
    }

    const client = new Client({ connectionString });
    await client.connect();
    const helper = new DbHelper(client);

    await use(helper);

    await helper.cleanup();
    await client.end();
  },
});

export { expect };
