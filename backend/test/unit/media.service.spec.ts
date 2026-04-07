import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MediaService } from '../../src/modules/cms/content/media/media.service';
import { Media } from '../../src/modules/cms/content/media/media.entity';
import { MinioService } from '../../src/config/minio/minio.service';
import { makeFile, makeMedia } from './config/factories/factories';
import { MediaType } from '../../src/modules/cms/content/media/media-types';

const mockMediaRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  manager: {
    transaction: jest.fn(),
  },
});

const mockMinioService = () => ({
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
});

describe('MediaService', () => {
  let service: MediaService;
  let mediaRepo: ReturnType<typeof mockMediaRepo>;
  let minioService: ReturnType<typeof mockMinioService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: getRepositoryToken(Media), useFactory: mockMediaRepo },
        { provide: MinioService, useFactory: mockMinioService },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    mediaRepo = module.get(getRepositoryToken(Media));
    minioService = module.get(MinioService);
  });

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => jest.clearAllMocks());

  describe('uploadMany', () => {
    it('throws when no files are provided', async () => {
      await expect(
        service.uploadMany('content-1', [], ['tmp-1']),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when files.length !== tempIds.length', async () => {
      await expect(
        service.uploadMany(
          'content-1',
          [makeFile() as unknown as Express.Multer.File],
          ['t1', 't2'],
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('uploads valid file and returns metadata', async () => {
      const file = makeFile();
      const media = makeMedia();
      minioService.uploadFile.mockResolvedValue('uuid.jpg');
      mediaRepo.create.mockReturnValue(media);
      mediaRepo.save.mockResolvedValue(media);

      const result = await service.uploadMany(
        'content-1',
        [file as unknown as Express.Multer.File],
        ['tmp-1'],
      );

      expect(minioService.uploadFile).toHaveBeenCalledWith(
        file,
        expect.stringMatching(/\.jpg$/),
      );
      expect(result).toHaveLength(1);
      expect(result[0].tempId).toBe('tmp-1');
    });

    it('skips files with unsupported MIME types', async () => {
      const validFile = makeFile();
      const invalidFile = makeFile({
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
      });
      const media = makeMedia();
      minioService.uploadFile.mockResolvedValue('key.jpg');
      mediaRepo.create.mockReturnValue(media);
      mediaRepo.save.mockResolvedValue(media);

      const result = await service.uploadMany(
        'content-1',
        [invalidFile, validFile].map(
          (f) => f as unknown as Express.Multer.File,
        ),
        ['tmp-bad', 'tmp-1'],
      );

      expect(result).toHaveLength(1);
      expect(minioService.uploadFile).toHaveBeenCalledTimes(1);
    });

    it('rolls back successful uploads when a later one fails', async () => {
      const file1 = makeFile({ originalname: 'a.jpg' });
      const file2 = makeFile({ originalname: 'b.jpg' });
      const media1 = makeMedia({ id: 'media-1' });

      minioService.uploadFile
        .mockResolvedValueOnce('key-a.jpg')
        .mockRejectedValueOnce(new Error('MinIO error'));

      mediaRepo.create.mockReturnValue(media1);
      mediaRepo.save.mockResolvedValue(media1);
      mediaRepo.find.mockResolvedValue([media1]);
      mediaRepo.delete.mockResolvedValue(undefined);
      minioService.deleteFile.mockResolvedValue(undefined);

      await expect(
        service.uploadMany(
          'content-1',
          [file1, file2].map((f) => f as unknown as Express.Multer.File),
          ['tmp-1', 'tmp-2'],
        ),
      ).rejects.toThrow(BadRequestException);

      expect(minioService.deleteFile).toHaveBeenCalledWith(media1.storageKey);
      expect(mediaRepo.delete).toHaveBeenCalled();
    });

    it('saves media with IMAGE type for image/* MIME', async () => {
      const file = makeFile({ mimetype: 'image/png', originalname: 'img.png' });
      const media = makeMedia({ type: MediaType.IMAGE });
      minioService.uploadFile.mockResolvedValue('key.png');
      mediaRepo.create.mockReturnValue(media);
      mediaRepo.save.mockResolvedValue(media);

      await service.uploadMany(
        'content-1',
        [file as unknown as Express.Multer.File],
        ['tmp-1'],
      );

      expect(mediaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: MediaType.IMAGE }),
      );
    });

    it('saves media with VIDEO type for video/* MIME', async () => {
      const file = makeFile({
        mimetype: 'video/mp4',
        originalname: 'clip.mp4',
      });
      const media = makeMedia({ type: MediaType.VIDEO });
      minioService.uploadFile.mockResolvedValue('key.mp4');
      mediaRepo.create.mockReturnValue(media);
      mediaRepo.save.mockResolvedValue(media);

      await service.uploadMany(
        'content-1',
        [file as unknown as Express.Multer.File],
        ['tmp-1'],
      );

      expect(mediaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: MediaType.VIDEO }),
      );
    });
  });

  describe('deleteMany', () => {
    it('is a no-op for empty array', async () => {
      await service.deleteMany([]);
      expect(mediaRepo.find).not.toHaveBeenCalled();
    });

    it('deletes files from MinIO then removes DB records', async () => {
      const media = makeMedia();
      mediaRepo.find
        .mockResolvedValueOnce([media]) // initial fetch
        .mockResolvedValueOnce([]); // reindex fetch
      mediaRepo.delete.mockResolvedValue(undefined);
      minioService.deleteFile.mockResolvedValue(undefined);

      await service.deleteMany(['media-1']);

      expect(minioService.deleteFile).toHaveBeenCalledWith(media.storageKey);
      expect(mediaRepo.delete).toHaveBeenCalledWith(['media-1']);
    });

    it('proceeds with DB deletion even when MinIO throws', async () => {
      const media = makeMedia();
      mediaRepo.find.mockResolvedValueOnce([media]).mockResolvedValueOnce([]);
      mediaRepo.delete.mockResolvedValue(undefined);
      minioService.deleteFile.mockRejectedValue(new Error('MinIO down'));

      await expect(service.deleteMany(['media-1'])).resolves.not.toThrow();
      expect(mediaRepo.delete).toHaveBeenCalledWith(['media-1']);
    });

    it('returns early when no matching records found in DB', async () => {
      mediaRepo.find.mockResolvedValue([]);

      await service.deleteMany(['ghost-id']);

      expect(minioService.deleteFile).not.toHaveBeenCalled();
      expect(mediaRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    it('is a no-op for empty array', async () => {
      await service.updateOrder([]);
      expect(mediaRepo.manager.transaction).not.toHaveBeenCalled();
    });

    it('applies negative temp orders first, then final orders', async () => {
      const media = makeMedia();
      const saves: Media[][] = [];

      mediaRepo.manager.transaction.mockImplementation(
        async (cb: (manager: EntityManager) => Promise<void>) => {
          const fakeRepo = {
            find: jest.fn().mockResolvedValue([media]),
            save: jest.fn().mockImplementation((items: Media[]) => {
              saves.push(items);
              return Promise.resolve(items);
            }),
          };
          await cb({
            getRepository: jest.fn().mockReturnValue(fakeRepo),
          } as unknown as EntityManager);
        },
      );

      await service.updateOrder([{ id: 'media-1', order: 2 }]);

      expect(saves).toHaveLength(2);
      expect(saves[0][0].order).toBeLessThan(0); // phase 1: temp negative
      expect(saves[1][0].order).toBe(2); // phase 2: real order
    });

    it('throws BadRequestException when a media ID is missing', async () => {
      mediaRepo.manager.transaction.mockImplementation(
        async (cb: (manager: EntityManager) => Promise<void>) => {
          const fakeRepo = {
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn(),
          };
          await cb({
            getRepository: jest.fn().mockReturnValue(fakeRepo),
          } as unknown as EntityManager);
        },
      );

      await expect(
        service.updateOrder([{ id: 'missing-id', order: 0 }]),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('rollbackUploads', () => {
    it('is a no-op for empty array', async () => {
      await service.rollbackUploads([]);
      expect(mediaRepo.find).not.toHaveBeenCalled();
    });

    it('removes files from MinIO and DB', async () => {
      const media = makeMedia();
      mediaRepo.find.mockResolvedValue([media]);
      mediaRepo.delete.mockResolvedValue(undefined);
      minioService.deleteFile.mockResolvedValue(undefined);

      await service.rollbackUploads(['media-1']);

      expect(minioService.deleteFile).toHaveBeenCalledWith(media.storageKey);
      expect(mediaRepo.delete).toHaveBeenCalledWith(['media-1']);
    });

    it('does not throw when MinIO deletion fails during rollback', async () => {
      const media = makeMedia();
      mediaRepo.find.mockResolvedValue([media]);
      mediaRepo.delete.mockResolvedValue(undefined);
      minioService.deleteFile.mockRejectedValue(new Error('unavailable'));

      await expect(service.rollbackUploads(['media-1'])).resolves.not.toThrow();
    });
  });

  describe('clearTempIds', () => {
    it('is a no-op for empty array', async () => {
      await service.clearTempIds([]);
      expect(mediaRepo.update).not.toHaveBeenCalled();
    });

    it('nullifies uploadTempId for the given IDs', async () => {
      mediaRepo.update.mockResolvedValue(undefined);

      await service.clearTempIds(['media-1', 'media-2']);

      expect(mediaRepo.update).toHaveBeenCalledWith(
        expect.anything() as unknown,
        { uploadTempId: null },
      );
    });
  });

  describe('alt text generation', () => {
    const captureAlt = async (filename: string): Promise<string> => {
      const file = makeFile({ originalname: filename });
      const media = makeMedia();
      minioService.uploadFile.mockResolvedValue('key');
      mediaRepo.create.mockReturnValue(media);
      mediaRepo.save.mockResolvedValue(media);

      await service.uploadMany(
        'content-1',
        [file as unknown as Express.Multer.File],
        ['tmp-1'],
      );

      const calls = jest.mocked(mediaRepo.create).mock.calls;
      const lastCall = calls[calls.length - 1] as [Record<string, unknown>];
      return lastCall[0]['alt'] as string;
    };

    it('replaces separators with spaces', async () => {
      expect(await captureAlt('my_photo-01.jpg')).toBe('my photo 01');
    });

    it('strips non-alphanumeric characters leaving alphanumeric and spaces', async () => {
      expect(await captureAlt('Hello(world)!.png')).toBe('Helloworld');
    });

    it('converts hyphens and underscores to spaces before stripping', async () => {
      expect(await captureAlt('hello_world-test.jpg')).toBe('hello world test');
    });

    it('falls back to "Media" for blank result', async () => {
      expect(await captureAlt('___.jpg')).toBe('Media');
    });
  });
});
