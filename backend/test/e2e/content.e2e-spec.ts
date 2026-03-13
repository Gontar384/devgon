import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  bootstrapTestApp,
  gql,
  gqlAsAdmin,
} from './config/helpers/e2e.helpers';

const GET_CONTENTS = `
  query GetContents($key: String!) {
    getContents(key: $key) {
      id key title subtitle description order
      media { id }
    }
  }
`;
const CREATE_CONTENT = `mutation CreateContent($key: String!) { createContent(key: $key) }`;
const UPDATE_CONTENT = `
  mutation UpdateContent($id: String!, $input: ContentInput!, $maxMedia: Int) {
    updateContent(id: $id, input: $input, maxMedia: $maxMedia)
  }
`;
const DELETE_CONTENT = `mutation DeleteContent($id: String!) { deleteContent(id: $id) }`;
const REORDER_CONTENTS = `
  mutation ReorderContents($key: String!, $ids: [String!]!) {
    reorderContents(key: $key, ids: $ids)
  }
`;

// Helper: insert a content row directly via SQL, returns the inserted id.
async function insertContent(
  ds: DataSource,
  fields: { key: string; order: number; title?: string },
): Promise<string> {
  const rows = await ds.query<Array<{ id: string }>>(
    `INSERT INTO "content" (key, "order", title)
     VALUES ($1, $2, $3) RETURNING id`,
    [fields.key, fields.order, fields.title ?? null],
  );
  return rows[0].id;
}

describe('Content (e2e)', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(() => {
    ({ app, dataSource: ds } = bootstrapTestApp());
  });

  beforeEach(async () => {
    await ds.query('DELETE FROM "media"');
    await ds.query('DELETE FROM "content"');
  });

  describe('getContents', () => {
    it('returns empty array when no content exists for key', async () => {
      const res = await gql(app, GET_CONTENTS, { key: 'hero' });
      expect(res.status).toBe(200);
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.getContents).toEqual([]);
    });

    it('returns only contents matching the requested key', async () => {
      await insertContent(ds, { key: 'hero', order: 0, title: 'Hero block' });
      await insertContent(ds, { key: 'about', order: 0, title: 'About block' });

      const res = await gql(app, GET_CONTENTS, { key: 'hero' });

      const contents = res.body.data.getContents as Array<{ title: string }>;
      expect(contents).toHaveLength(1);
      expect(contents[0].title).toBe('Hero block');
    });

    it('returns contents sorted by order ascending', async () => {
      await insertContent(ds, { key: 'hero', order: 2, title: 'Third' });
      await insertContent(ds, { key: 'hero', order: 0, title: 'First' });
      await insertContent(ds, { key: 'hero', order: 1, title: 'Second' });

      const res = await gql(app, GET_CONTENTS, { key: 'hero' });

      const titles = (
        res.body.data.getContents as Array<{ title: string }>
      ).map((c) => c.title);
      expect(titles).toEqual(['First', 'Second', 'Third']);
    });
  });

  describe('createContent', () => {
    it('rejects unauthenticated callers', async () => {
      const res = await gql(app, CREATE_CONTENT, { key: 'hero' });
      expect(res.body.errors).toBeDefined();
    });

    it('creates first block with order 0', async () => {
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      const rows = await ds.query<Array<{ order: number }>>(
        'SELECT "order" FROM "content" WHERE key = $1',
        ['hero'],
      );
      expect(rows[0].order).toBe(0);
    });

    it('appends subsequent blocks with incrementing order', async () => {
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });

      const rows = await ds.query<Array<{ order: number }>>(
        'SELECT "order" FROM "content" WHERE key = $1 ORDER BY "order" ASC',
        ['hero'],
      );
      expect(rows.map((r) => r.order)).toEqual([0, 1, 2]);
    });

    it('initializes text fields as null', async () => {
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      const rows = await ds.query<
        Array<{ title: null; subtitle: null; description: null }>
      >('SELECT title, subtitle, description FROM "content" WHERE key = $1', [
        'hero',
      ]);
      expect(rows[0].title).toBeNull();
      expect(rows[0].subtitle).toBeNull();
      expect(rows[0].description).toBeNull();
    });

    it('does not share order counter between different keys', async () => {
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'hero' });
      await gqlAsAdmin(app, CREATE_CONTENT, { key: 'about' });

      const rows = await ds.query<Array<{ order: number }>>(
        'SELECT "order" FROM "content" WHERE key = $1',
        ['about'],
      );
      expect(rows[0].order).toBe(0);
    });
  });

  describe('updateContent', () => {
    it('trims whitespace from text fields', async () => {
      const id = await insertContent(ds, { key: 'hero', order: 0 });

      await gqlAsAdmin(app, UPDATE_CONTENT, {
        id,
        input: {
          title: '  Trimmed  ',
          subtitle: ' Subtitle ',
          description: 'Desc',
          mediaOrder: [],
        },
      });

      const rows = await ds.query<Array<{ title: string; subtitle: string }>>(
        'SELECT title, subtitle FROM "content" WHERE id = $1',
        [id],
      );
      expect(rows[0].title).toBe('Trimmed');
      expect(rows[0].subtitle).toBe('Subtitle');
    });

    it('coerces blank string to null', async () => {
      const id = await insertContent(ds, {
        key: 'hero',
        order: 0,
        title: 'Old',
      });

      await gqlAsAdmin(app, UPDATE_CONTENT, {
        id,
        input: { title: '   ', mediaOrder: [] },
      });

      const rows = await ds.query<Array<{ title: string | null }>>(
        'SELECT title FROM "content" WHERE id = $1',
        [id],
      );
      expect(rows[0].title).toBeNull();
    });

    it('returns error for non-existent content id', async () => {
      const res = await gqlAsAdmin(app, UPDATE_CONTENT, {
        id: '00000000-0000-0000-0000-000000000000',
        input: { mediaOrder: [] },
      });
      expect(res.body.errors).toBeDefined();
    });

    it('rejects unauthenticated callers', async () => {
      const id = await insertContent(ds, { key: 'hero', order: 0 });
      const res = await gql(app, UPDATE_CONTENT, {
        id,
        input: { mediaOrder: [] },
      });
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('deleteContent', () => {
    it('deletes content and returns true', async () => {
      const id = await insertContent(ds, { key: 'hero', order: 0 });
      const res = await gqlAsAdmin(app, DELETE_CONTENT, { id });

      expect(res.body.data.deleteContent).toBe(true);
      const rows = await ds.query<Array<{ contentId: string }>>(
        'SELECT id FROM "content" WHERE id = $1',
        [id],
      );
      expect(rows).toHaveLength(0);
    });

    it('returns false for non-existent id', async () => {
      const res = await gqlAsAdmin(app, DELETE_CONTENT, {
        id: '00000000-0000-0000-0000-000000000000',
      });
      expect(res.body.data.deleteContent).toBe(false);
    });

    it('reindexes remaining contents after deletion', async () => {
      const c1 = await insertContent(ds, { key: 'hero', order: 0 });
      const c2 = await insertContent(ds, { key: 'hero', order: 1 });
      const c3 = await insertContent(ds, { key: 'hero', order: 2 });

      await gqlAsAdmin(app, DELETE_CONTENT, { id: c2 });

      const rows = await ds.query<Array<{ id: string; order: number }>>(
        'SELECT id, "order" FROM "content" WHERE key = $1 ORDER BY "order" ASC',
        ['hero'],
      );
      expect(rows.map((r) => r.order)).toEqual([0, 1]);
      expect(rows.map((r) => r.id)).toEqual([c1, c3]);
    });

    it('rejects unauthenticated callers', async () => {
      const id = await insertContent(ds, { key: 'hero', order: 0 });
      const res = await gql(app, DELETE_CONTENT, { id });
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('reorderContents', () => {
    it('reorders blocks according to provided ids array', async () => {
      const c1 = await insertContent(ds, { key: 'hero', order: 0 });
      const c2 = await insertContent(ds, { key: 'hero', order: 1 });
      const c3 = await insertContent(ds, { key: 'hero', order: 2 });

      const res = await gqlAsAdmin(app, REORDER_CONTENTS, {
        key: 'hero',
        ids: [c3, c1, c2],
      });

      expect(res.body.data.reorderContents).toBe(true);

      const rows = await ds.query<Array<{ id: string }>>(
        'SELECT id FROM "content" WHERE key = $1 ORDER BY "order" ASC',
        ['hero'],
      );
      expect(rows.map((r) => r.id)).toEqual([c3, c1, c2]);
    });

    it('returns true when order is already correct', async () => {
      const c1 = await insertContent(ds, { key: 'hero', order: 0 });
      const c2 = await insertContent(ds, { key: 'hero', order: 1 });

      const res = await gqlAsAdmin(app, REORDER_CONTENTS, {
        key: 'hero',
        ids: [c1, c2],
      });
      expect(res.body.data.reorderContents).toBe(true);
    });

    it('rejects unauthenticated callers', async () => {
      const res = await gql(app, REORDER_CONTENTS, { key: 'hero', ids: [] });
      expect(res.body.errors).toBeDefined();
    });
  });
});
