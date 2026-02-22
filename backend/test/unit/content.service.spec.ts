import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { MinioService } from '../../src/config/minio/minio.service';
import { ContentService } from '../../src/modules/cms/content/content.service';
import { Content } from '../../src/modules/cms/content/content.entity';
import { MediaService } from '../../src/modules/cms/content/media/media.service';
import { baseInput, makeContent } from './config/factories/factories';
import { ContentInput } from '../../src/modules/cms/content/content.input';

const mockContentRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockMediaService = () => ({
  findByTempId: jest.fn(),
  deleteMany: jest.fn(),
  rollbackUploads: jest.fn(),
  updateOrder: jest.fn(),
  clearTempIds: jest.fn(),
});

const mockMinioService = () => ({
  getSignedUrl: jest.fn(),
});

describe('ContentService', () => {
  let service: ContentService;
  let contentRepo: ReturnType<typeof mockContentRepo>;
  let mediaService: ReturnType<typeof mockMediaService>;
  let minioService: ReturnType<typeof mockMinioService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getRepositoryToken(Content), useFactory: mockContentRepo },
        { provide: MediaService, useFactory: mockMediaService },
        { provide: MinioService, useFactory: mockMinioService },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    contentRepo = module.get(getRepositoryToken(Content));
    mediaService = module.get(MediaService);
    minioService = module.get(MinioService);
  });

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMany', () => {
    it('enriches media with signed URLs', async () => {
      const media = {
        id: 'm1',
        storageKey: 'key.jpg',
        order: 0,
      } as Content['media'][number];
      const content = makeContent({ media: [media] });
      contentRepo.find.mockResolvedValue([content]);
      minioService.getSignedUrl.mockResolvedValue('https://signed.url/key.jpg');

      const result = await service.getMany('hero');

      expect(minioService.getSignedUrl).toHaveBeenCalledWith('key.jpg');
      expect(
        (result[0].media[0] as unknown as Record<string, unknown>)['url'],
      ).toBe('https://signed.url/key.jpg');
    });

    it('skips URL enrichment for contents with no media', async () => {
      contentRepo.find.mockResolvedValue([makeContent({ media: [] })]);
      await service.getMany('hero');
      expect(minioService.getSignedUrl).not.toHaveBeenCalled();
    });

    it('returns empty array when no content exists for key', async () => {
      contentRepo.find.mockResolvedValue([]);
      expect(await service.getMany('nonexistent')).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates first block with order 0', async () => {
      contentRepo.findOne.mockResolvedValue(null);
      contentRepo.create.mockReturnValue({});
      contentRepo.save.mockResolvedValue(undefined);

      await service.create('hero');

      expect(contentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'hero', order: 0 }),
      );
    });

    it('appends block at lastBlock.order + 1', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ order: 2 }));
      contentRepo.create.mockReturnValue({});
      contentRepo.save.mockResolvedValue(undefined);

      await service.create('hero');

      expect(contentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ order: 3 }),
      );
    });

    it('initializes text fields as null', async () => {
      contentRepo.findOne.mockResolvedValue(null);
      contentRepo.create.mockReturnValue({});
      contentRepo.save.mockResolvedValue(undefined);

      await service.create('hero');

      expect(contentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: null,
          header: null,
          description: null,
        }),
      );
    });
  });

  describe('update', () => {
    it('throws when content not found', async () => {
      contentRepo.findOne.mockResolvedValue(null);
      await expect(service.update('missing-id', baseInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('trims text fields before saving', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      contentRepo.update.mockResolvedValue(undefined);

      await service.update('content-1', baseInput);

      expect(contentRepo.update).toHaveBeenCalledWith(
        { id: 'content-1' },
        expect.objectContaining({ title: 'New Title' }),
      );
    });

    it('coerces whitespace-only string to null', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      contentRepo.update.mockResolvedValue(undefined);

      await service.update('content-1', { ...baseInput, title: '   ' });

      expect(contentRepo.update).toHaveBeenCalledWith(
        { id: 'content-1' },
        expect.objectContaining({ title: null }),
      );
    });

    it('skips repo.update when no text fields in input', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      await service.update('content-1', { mediaOrder: [] });
      expect(contentRepo.update).not.toHaveBeenCalled();
    });

    it('resolves new media from tempId', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      mediaService.findByTempId.mockResolvedValue({ id: 'media-new' });
      mediaService.updateOrder.mockResolvedValue(undefined);
      mediaService.clearTempIds.mockResolvedValue(undefined);

      await service.update('content-1', {
        mediaOrder: [{ kind: 'new', tempId: 'tmp-1', order: 0 }],
      });

      expect(mediaService.findByTempId).toHaveBeenCalledWith('tmp-1');
      expect(mediaService.clearTempIds).toHaveBeenCalledWith(['media-new']);
    });

    it('throws when tempId cannot be resolved', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      mediaService.findByTempId.mockResolvedValue(null);

      await expect(
        service.update('content-1', {
          mediaOrder: [{ kind: 'new', tempId: 'bad', order: 0 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deletes media that was removed from mediaOrder', async () => {
      const old = { id: 'old-media' } as Content['media'][number];
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [old] }));
      mediaService.deleteMany.mockResolvedValue(undefined);

      await service.update('content-1', { mediaOrder: [] });

      expect(mediaService.deleteMany).toHaveBeenCalledWith(['old-media']);
    });

    it('throws and rolls back newly uploaded media when maxMedia exceeded', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));

      mediaService.findByTempId
        .mockResolvedValueOnce({ id: 'media-new-1' })
        .mockResolvedValueOnce({ id: 'media-new-2' });

      mediaService.rollbackUploads.mockResolvedValue(undefined);

      const input: ContentInput = {
        mediaOrder: [
          { kind: 'new', tempId: 'tmp-1', order: 0 },
          { kind: 'new', tempId: 'tmp-2', order: 1 },
        ],
      };

      await expect(service.update('content-1', input, 1)).rejects.toThrow(
        BadRequestException,
      );

      expect(mediaService.rollbackUploads).toHaveBeenCalledWith([
        'media-new-1',
        'media-new-2',
      ]);
      expect(mediaService.updateOrder).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('returns false when content not found', async () => {
      contentRepo.findOne.mockResolvedValue(null);
      expect(await service.delete('missing-id')).toBe(false);
    });

    it('cascades media deletion before removing content', async () => {
      const m1 = { id: 'm1' } as Content['media'][number];
      const m2 = { id: 'm2' } as Content['media'][number];
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [m1, m2] }));
      contentRepo.delete.mockResolvedValue(undefined);
      mediaService.deleteMany.mockResolvedValue(undefined);
      contentRepo.find.mockResolvedValue([]);

      const result = await service.delete('content-1');

      expect(mediaService.deleteMany).toHaveBeenCalledWith(['m1', 'm2']);
      expect(contentRepo.delete).toHaveBeenCalledWith({ id: 'content-1' });
      expect(result).toBe(true);
    });

    it('reindexes remaining contents to fill the gap', async () => {
      contentRepo.findOne.mockResolvedValue(makeContent({ media: [] }));
      contentRepo.delete.mockResolvedValue(undefined);
      contentRepo.find.mockResolvedValue([
        makeContent({ id: 'c2', order: 1 }),
        makeContent({ id: 'c3', order: 2 }),
      ]);
      contentRepo.save.mockResolvedValue(undefined);

      await service.delete('content-1');

      expect(contentRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'c2', order: 0 }),
          expect.objectContaining({ id: 'c3', order: 1 }),
        ]),
      );
    });
  });

  describe('reorder', () => {
    it('sets order based on position in ids array', async () => {
      contentRepo.find.mockResolvedValue([
        makeContent({ id: 'c1', order: 0 }),
        makeContent({ id: 'c2', order: 1 }),
      ]);
      contentRepo.save.mockResolvedValue(undefined);

      const result = await service.reorder('hero', ['c2', 'c1']);

      expect(contentRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'c2', order: 0 }),
          expect.objectContaining({ id: 'c1', order: 1 }),
        ]),
      );
      expect(result).toBe(true);
    });

    it('skips save when order is already correct', async () => {
      contentRepo.find.mockResolvedValue([
        makeContent({ id: 'c1', order: 0 }),
        makeContent({ id: 'c2', order: 1 }),
      ]);

      await service.reorder('hero', ['c1', 'c2']);

      expect(contentRepo.save).not.toHaveBeenCalled();
    });
  });
});
