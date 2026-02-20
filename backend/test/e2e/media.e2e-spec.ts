import * as Minio from 'minio';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import {
  bootstrapTestApp,
  gqlAsAdmin,
  adminCookie,
} from '../config/helpers/e2e.helpers';

const TEST_BUCKET = 'media-test';

const minioClient = new Minio.Client({
  endPoint: process.env['MINIO_ENDPOINT'] ?? 'localhost',
  port: parseInt(process.env['MINIO_PORT'] ?? '9000', 10),
  useSSL: process.env['MINIO_USE_SSL'] === 'true',
  accessKey: process.env['MINIO_ROOT_USER'] ?? 'minioadmin',
  secretKey: process.env['MINIO_ROOT_PASSWORD'] ?? 'minioadmin123',
});

async function listBucketObjects(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const keys: string[] = [];
    const stream = minioClient.listObjects(TEST_BUCKET, '', true);
    stream.on('data', (obj) => {
      if (obj.name) keys.push(obj.name);
    });
    stream.on('end', () => resolve(keys));
    stream.on('error', reject);
  });
}

async function emptyTestBucket(): Promise<void> {
  const keys = await listBucketObjects();
  if (keys.length > 0) {
    await minioClient.removeObjects(TEST_BUCKET, keys);
  }
}

// Insert a content row directly via SQL, returns inserted id.
async function insertContent(
  ds: DataSource,
  key: string,
  order: number,
): Promise<string> {
  const rows = await ds.query<Array<{ id: string }>>(
    `INSERT INTO "content" (key, "order")
     VALUES ($1, $2) RETURNING id`,
    [key, order],
  );
  return rows[0].id;
}

describe('Media upload (e2e)', () => {
  let app: INestApplication;
  let ds: DataSource;

  const server = () => app.getHttpServer() as Parameters<typeof request>[0];

  const uploadFiles = (
    contentId: string,
    files: Array<{ name: string; buffer: Buffer; mime: string }>,
    tempIds: string[],
  ): request.Test =>
    files.reduce(
      (req, f) =>
        req.attach('files', f.buffer, {
          filename: f.name,
          contentType: f.mime,
        }),
      request(server())
        .post(`/api/media/upload/${contentId}`)
        .set('Cookie', adminCookie())
        .field('tempIds', JSON.stringify(tempIds)),
    );

  beforeAll(async () => {
    process.env['MINIO_BUCKET_NAME'] = TEST_BUCKET;
    ({ app, dataSource: ds } = bootstrapTestApp());

    const exists = await minioClient.bucketExists(TEST_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(TEST_BUCKET, 'eu-central-1');
    }
  });

  beforeEach(async () => {
    await emptyTestBucket();
    await ds.query('DELETE FROM "media"');
    await ds.query('DELETE FROM "content"');
  });

  describe('POST /media/upload/:contentId', () => {
    it('rejects unauthenticated requests', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await request(server())
        .post(`/api/media/upload/${contentId}`)
        .attach('files', Buffer.from('data'), {
          filename: 'img.jpg',
          contentType: 'image/jpeg',
        })
        .field('tempIds', JSON.stringify(['tmp-1']));

      expect([401, 403]).toContain(res.status);
    });

    it('uploads a single image and stores it in MinIO + DB', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await uploadFiles(
        contentId,
        [
          {
            name: 'photo.jpg',
            buffer: Buffer.from('fake-image-data'),
            mime: 'image/jpeg',
          },
        ],
        ['tmp-1'],
      );

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.media).toHaveLength(1);
      expect(res.body.media[0].tempId).toBe('tmp-1');

      const rows = await ds.query<Array<{ contentId: string }>>(
        'SELECT "contentId" FROM "media" WHERE "uploadTempId" = $1',
        ['tmp-1'],
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].contentId).toBe(contentId);

      const objects = await listBucketObjects();
      expect(objects).toHaveLength(1);
      expect(objects[0]).toMatch(/\.jpg$/);
    });

    it('uploads multiple files in one request', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await uploadFiles(
        contentId,
        [
          {
            name: 'photo.jpg',
            buffer: Buffer.from('img1'),
            mime: 'image/jpeg',
          },
          { name: 'clip.mp4', buffer: Buffer.from('vid1'), mime: 'video/mp4' },
        ],
        ['tmp-1', 'tmp-2'],
      );

      expect(res.status).toBe(201);
      expect(res.body.media).toHaveLength(2);
      expect(await listBucketObjects()).toHaveLength(2);
    });

    it('skips unsupported MIME types and uploads only valid ones', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await uploadFiles(
        contentId,
        [
          {
            name: 'doc.pdf',
            buffer: Buffer.from('pdf'),
            mime: 'application/pdf',
          },
          { name: 'photo.jpg', buffer: Buffer.from('img'), mime: 'image/jpeg' },
        ],
        ['tmp-bad', 'tmp-good'],
      );

      expect(res.status).toBe(201);
      expect(res.body.media).toHaveLength(1);
      expect(res.body.media[0].tempId).toBe('tmp-good');
      expect(await listBucketObjects()).toHaveLength(1);
    });

    it('returns 400 when tempIds JSON is malformed', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await request(server())
        .post(`/api/media/upload/${contentId}`)
        .set('Cookie', adminCookie())
        .attach('files', Buffer.from('img'), {
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
        })
        .field('tempIds', 'not-valid-json');

      expect(res.status).toBe(400);
    });

    it('returns 400 when tempIds count does not match files count', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const res = await uploadFiles(
        contentId,
        [
          { name: 'a.jpg', buffer: Buffer.from('img1'), mime: 'image/jpeg' },
          { name: 'b.jpg', buffer: Buffer.from('img2'), mime: 'image/jpeg' },
        ],
        ['only-one-temp-id'],
      );

      expect(res.status).toBe(400);
    });
  });

  describe('upload → updateContent integration', () => {
    const UPDATE_CONTENT = `
      mutation UpdateContent($id: String!, $input: ContentInput!, $maxMedia: Int) {
        updateContent(id: $id, input: $input, maxMedia: $maxMedia)
      }
    `;

    it('clears tempId after updateContent confirms the upload', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const uploadRes = await uploadFiles(
        contentId,
        [{ name: 'photo.jpg', buffer: Buffer.from('img'), mime: 'image/jpeg' }],
        ['tmp-1'],
      );
      expect(uploadRes.status).toBe(201);
      const mediaId: string = uploadRes.body.media[0].id as string;

      const updateRes = await gqlAsAdmin(app, UPDATE_CONTENT, {
        id: contentId,
        input: {
          title: 'Updated',
          mediaOrder: [{ kind: 'new', tempId: 'tmp-1', order: 0 }],
        },
      });

      expect(updateRes.body.errors).toBeUndefined();
      expect(updateRes.body.data.updateContent).toBe(true);

      const rows = await ds.query<Array<{ uploadTempId: string | null }>>(
        'SELECT "uploadTempId" FROM "media" WHERE id = $1',
        [mediaId],
      );
      expect(rows[0].uploadTempId).toBeNull();
      expect(await listBucketObjects()).toHaveLength(1);
    });

    it('rolls back files from MinIO when maxMedia is exceeded', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      const uploadRes = await uploadFiles(
        contentId,
        [
          { name: 'a.jpg', buffer: Buffer.from('img1'), mime: 'image/jpeg' },
          { name: 'b.jpg', buffer: Buffer.from('img2'), mime: 'image/jpeg' },
        ],
        ['tmp-1', 'tmp-2'],
      );
      expect(uploadRes.status).toBe(201);

      const limitRes = await gqlAsAdmin(app, UPDATE_CONTENT, {
        id: contentId,
        input: {
          mediaOrder: [
            { kind: 'new', tempId: 'tmp-1', order: 0 },
            { kind: 'new', tempId: 'tmp-2', order: 1 },
          ],
        },
        maxMedia: 1,
      });

      expect(limitRes.body.errors).toBeDefined();

      await new Promise((r) => setTimeout(r, 300));
      expect(await listBucketObjects()).toHaveLength(0);

      const remaining = await ds.query<Array<{ contentId: string }>>(
        'SELECT id FROM "media" WHERE "contentId" = $1',
        [contentId],
      );
      expect(remaining).toHaveLength(0);
    });

    it('removes file from MinIO when excluded from mediaOrder on update', async () => {
      const contentId = await insertContent(ds, 'hero', 0);

      await uploadFiles(
        contentId,
        [{ name: 'photo.jpg', buffer: Buffer.from('img'), mime: 'image/jpeg' }],
        ['tmp-1'],
      );

      await gqlAsAdmin(app, UPDATE_CONTENT, {
        id: contentId,
        input: { mediaOrder: [{ kind: 'new', tempId: 'tmp-1', order: 0 }] },
      });
      expect(await listBucketObjects()).toHaveLength(1);

      await gqlAsAdmin(app, UPDATE_CONTENT, {
        id: contentId,
        input: { mediaOrder: [] },
      });

      await new Promise((r) => setTimeout(r, 300));
      expect(await listBucketObjects()).toHaveLength(0);

      const remaining = await ds.query<Array<{ contentId: string }>>(
        'SELECT id FROM "media" WHERE "contentId" = $1',
        [contentId],
      );
      expect(remaining).toHaveLength(0);
    });
  });
});
