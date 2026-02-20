import { Media } from '../../../src/modules/cms/content/media/media.entity';
import { Content } from '../../../src/modules/cms/content/content.entity';
import { MediaType } from '../../../src/modules/cms/content/media/media-types';

/**
 * Represents an uploaded file as Multer sees it.
 * Defined here explicitly so factory functions are fully typed
 * and don't leak `any` into tests.
 */
export interface MockFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const makeFile = (overrides: Partial<MockFile> = {}): MockFile => ({
  originalname: 'photo.jpg',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('data'),
  size: 1024,
  ...overrides,
});

export const makeMedia = (overrides: Partial<Media> = {}): Media =>
  ({
    id: 'media-1',
    filename: 'photo.jpg',
    storageKey: 'uuid-123.jpg',
    uploadTempId: 'tmp-1',
    mimeType: 'image/jpeg',
    type: MediaType.IMAGE,
    size: 1024,
    alt: 'Photo',
    order: 0,
    contentId: 'content-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Media;

export const makeContent = (overrides: Partial<Content> = {}): Content =>
  ({
    id: 'content-1',
    key: 'hero',
    title: 'Title',
    header: 'Header',
    description: 'Desc',
    order: 0,
    media: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Content;

export const baseInput = {
  title: '  New Title  ' as string,
  header: 'Header',
  description: 'Desc',
  mediaOrder: [] as Array<
    | { kind: 'existing'; id: string; order: number }
    | { kind: 'new'; tempId: string; order: number }
  >,
};
