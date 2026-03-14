import * as path from 'path';
import { Page } from '@playwright/test';
import { test, expect } from './config/fixtures/fixtures';
import { ContentManagerPOM } from './config/poms/content.pom';
import { fileURLToPath } from 'url';
import fs from 'fs';

/**
 * End-to-end tests for the CMS content management UI.
 *
 * Covers the same operations tested in the Jest e2e suite but exercised
 * from the user's perspective through a real browser:
 *   - createContent  (add card button)
 *   - updateContent  (edit → save / cancel)
 *   - deleteContent  (delete button + confirm)
 *   - reorderContents (drag-and-drop)
 *   - media upload   (file input → save → DB assertion)
 *
 * Auth is pre-established via a JWT cookie injected in globalSetup —
 * no Google OAuth interaction is needed.
 *
 * The `db` fixture provides direct Postgres access for seeding and
 * post-action DB assertions. It also runs DELETE on content + media
 * after every test to guarantee isolation.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CMS_URL = '/admin/home';
const SINGLE_KEY = 'home-hero'; // mode="single", maxMedia=0
const MULTI_KEY = 'home-services'; // mode="multiple", maxMedia=1

/**
 * Minimal 1×1 JPEG — created inline so no external file is needed.
 * Written to disk once, reused across all media tests.
 */
const TEST_IMAGE = path.resolve(__dirname, 'config/data/test-image.jpg');

const MINIMAL_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkS' +
    'Ew8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAAB' +
    'AAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/' +
    '2gAIAQEAAT8AKf/Z',
  'base64',
);

fs.mkdirSync(path.dirname(TEST_IMAGE), { recursive: true });
if (!fs.existsSync(TEST_IMAGE)) {
  fs.writeFileSync(TEST_IMAGE, MINIMAL_JPEG);
}

async function goToCms(page: Page): Promise<{
  single: ContentManagerPOM;
  multi: ContentManagerPOM;
}> {
  await page.goto(CMS_URL);
  await page.waitForLoadState('networkidle');
  return {
    single: new ContentManagerPOM(page, 0),
    multi: new ContentManagerPOM(page, 1),
  };
}

async function waitForGql(page: Page): Promise<void> {
  await page.waitForResponse(
    (r) => r.url().includes('/api/graphql') && r.status() === 200,
  );
}

/** Tiptap wraps text in <p> tags — strip them for plain-text comparison. */
function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}

test.describe('createContent', () => {
  test('clicking Add on multi-manager creates a card in the UI', async ({
    adminPage,
    db: _db,
  }) => {
    const { multi } = await goToCms(adminPage);
    await multi.waitForCardCount(0);
    await multi.clickAdd();
    await multi.waitForCardCount(1);
  });

  test('three Add clicks produce order [0, 1, 2] in the DB', async ({
    adminPage,
    db,
  }) => {
    const { multi } = await goToCms(adminPage);
    await multi.clickAdd();
    await multi.clickAdd();
    await multi.clickAdd();
    await multi.waitForCardCount(3);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(rows.map((r) => r.order)).toEqual([0, 1, 2]);
  });

  test('Add button is disabled in single mode after first card', async ({
    adminPage,
    db,
  }) => {
    await db.insertContent({ key: SINGLE_KEY, order: 0, title: 'Existing' });
    const { single } = await goToCms(adminPage);
    await single.waitForCardCount(1);
    await single.expectAddButtonDisabled();
  });
});

test.describe('updateContent — text fields', () => {
  test('saves title and reflects the change in DB', async ({
    adminPage,
    db,
  }) => {
    await db.insertContent({ key: MULTI_KEY, order: 0, title: 'Old Title' });
    const { multi } = await goToCms(adminPage);

    const card = multi.card(0);
    await card.clickEdit();
    await card.fillTitle('New Title');
    await card.fillSubtitle('New Subtitle');
    await card.fillDescription('New Description');
    await card.clickSave();

    await waitForGql(adminPage);

    await expect(adminPage.getByText(/edytowana/i)).toBeVisible({
      timeout: 6_000,
    });

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(stripHtml(rows[0].title)).toBe('New Title');
  });

  test('server trims whitespace — DB stores trimmed value', async ({
    adminPage,
    db,
  }) => {
    await db.insertContent({ key: MULTI_KEY, order: 0, title: 'Placeholder' });
    const { multi } = await goToCms(adminPage);

    const card = multi.card(0);
    await card.clickEdit();
    await card.fillTitle('Trimmed');
    await card.clickSave();

    await waitForGql(adminPage);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(stripHtml(rows[0].title)).toBe('Trimmed');
  });

  test('cancel discards local edits without mutating DB', async ({
    adminPage,
    db,
  }) => {
    await db.insertContent({ key: MULTI_KEY, order: 0, title: 'Original' });
    const { multi } = await goToCms(adminPage);

    const card = multi.card(0);
    await card.clickEdit();
    await card.fillTitle('Should Not Be Saved');
    await card.clickCancel();

    await card.expectEditing(false);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(stripHtml(rows[0].title)).toBe('Original');
  });
});

test.describe('deleteContent', () => {
  test('deletes card from UI and DB', async ({ adminPage, db }) => {
    await db.insertContent({ key: MULTI_KEY, order: 0, title: 'To Delete' });
    const { multi } = await goToCms(adminPage);

    await multi.waitForCardCount(1);
    await multi.card(0).clickDelete();
    await multi.waitForCardCount(0);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(rows).toHaveLength(0);
  });

  test('deleting middle card reindexes the remaining two', async ({
    adminPage,
    db,
  }) => {
    const c1 = await db.insertContent({
      key: MULTI_KEY,
      order: 0,
      title: 'First',
    });
    await db.insertContent({ key: MULTI_KEY, order: 1, title: 'Second' });
    const c3 = await db.insertContent({
      key: MULTI_KEY,
      order: 2,
      title: 'Third',
    });

    const { multi } = await goToCms(adminPage);
    await multi.waitForCardCount(3);

    await multi.card(1).clickDelete();
    await multi.waitForCardCount(2);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(rows.map((r) => r.order)).toEqual([0, 1]);
    expect(rows.map((r) => r.id)).toEqual([c1, c3]);
  });
});

test.describe('reorderContents', () => {
  test('pressing move-right button shifts card one position forward in DB', async ({
    adminPage,
    db,
  }) => {
    const c1 = await db.insertContent({
      key: MULTI_KEY,
      order: 0,
      title: 'Alpha',
    });
    const c2 = await db.insertContent({
      key: MULTI_KEY,
      order: 1,
      title: 'Beta',
    });

    const { multi } = await goToCms(adminPage);
    await multi.waitForCardCount(2);

    await multi.card(0).clickMoveRight();
    await waitForGql(adminPage);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(rows.map((r) => r.id)).toEqual([c2, c1]);
  });

  test('pressing move-left button shifts card one position back in DB', async ({
    adminPage,
    db,
  }) => {
    const c1 = await db.insertContent({
      key: MULTI_KEY,
      order: 0,
      title: 'Alpha',
    });
    const c2 = await db.insertContent({
      key: MULTI_KEY,
      order: 1,
      title: 'Beta',
    });

    const { multi } = await goToCms(adminPage);
    await multi.waitForCardCount(2);

    await multi.card(1).clickMoveLeft();
    await waitForGql(adminPage);

    const rows = await db.getContentsByKey(MULTI_KEY);
    expect(rows.map((r) => r.id)).toEqual([c2, c1]);
  });
});

test.describe('media upload', () => {
  test('uploading an image persists media in DB with cleared tempId', async ({
    adminPage,
    db,
  }) => {
    const contentId = await db.insertContent({ key: MULTI_KEY, order: 0 });
    const { multi } = await goToCms(adminPage);

    const card = multi.card(0);
    await card.clickEdit();
    await card.uploadFile(TEST_IMAGE);
    await card.expectMediaCount(1);

    const uploadDone = adminPage.waitForResponse(
      (r) => r.url().includes('/api/media/upload/') && r.status() === 201,
    );
    await card.clickSave();
    await uploadDone;
    await waitForGql(adminPage);

    const media = await db.getMediaForContent(contentId);
    expect(media).toHaveLength(1);
    expect(media[0].uploadTempId).toBeNull();

    await card.expectMediaCount(1);
  });

  test('removing media from the list deletes it from DB on save', async ({
    adminPage,
    db,
  }) => {
    const contentId = await db.insertContent({ key: MULTI_KEY, order: 0 });
    const { multi } = await goToCms(adminPage);
    const card = multi.card(0);

    await card.clickEdit();
    await card.uploadFile(TEST_IMAGE);
    const uploadDone = adminPage.waitForResponse(
      (r) => r.url().includes('/api/media/upload/') && r.status() === 201,
    );
    await card.clickSave();
    await uploadDone;
    await waitForGql(adminPage);

    await card.clickEdit();
    await card.removeMediaAt(0);
    await card.expectMediaCount(0);
    await card.clickSave();
    await waitForGql(adminPage);

    await adminPage.waitForTimeout(400);

    const media = await db.getMediaForContent(contentId);
    expect(media).toHaveLength(0);
  });

  test('cancel after selecting a file does not persist anything to DB', async ({
    adminPage,
    db,
  }) => {
    const contentId = await db.insertContent({ key: MULTI_KEY, order: 0 });
    const { multi } = await goToCms(adminPage);
    const card = multi.card(0);

    await card.clickEdit();
    await card.uploadFile(TEST_IMAGE);
    await card.expectMediaCount(1);

    await card.clickCancel();
    await card.expectEditing(false);

    const media = await db.getMediaForContent(contentId);
    expect(media).toHaveLength(0);
  });
});
