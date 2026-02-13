import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Media, MediaType } from './media.entity';
import { MinioService } from '../../../config/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFileType, UploadedMediaInfo } from './media-types';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  private readonly ALLOWED_IMAGE_MIMETYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  private readonly ALLOWED_VIDEO_MIMETYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ];

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly minioService: MinioService,
  ) {}

  async uploadMany(
    contentId: string,
    files: UploadedFileType[],
    maxMedia?: number,
  ): Promise<UploadedMediaInfo[]> {
    if (!files?.length) {
      throw new BadRequestException('Brak plików do uploadu');
    }

    this.logger.log(
      `📤 Uploading ${files.length} files for content ${contentId}`,
    );

    if (maxMedia !== undefined) {
      await this.validateMediaLimit(contentId, files.length, maxMedia);
    }

    const startOrder = await this.getNextOrder(contentId);

    const uploadedMedia: UploadedMediaInfo[] = [];
    const skippedFiles: string[] = [];
    let orderOffset = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.isValidFileType(file)) {
        this.logger.warn(
          `⚠️ Skipping invalid file type: ${file.originalname} (${file.mimetype})`,
        );
        skippedFiles.push(file.originalname);
        continue;
      }

      const order = startOrder + orderOffset;
      orderOffset++;

      try {
        const media = await this.uploadSingle(contentId, file, order);
        uploadedMedia.push({
          id: media.id,
          filename: media.filename,
          type: media.type,
          order: media.order,
        });
      } catch (error) {
        await this.rollbackUploads(uploadedMedia);

        this.logger.error(
          `Upload failed for ${file.originalname}:`,
          error instanceof Error ? error.stack : String(error),
        );
        throw new BadRequestException(
          `Nie udało się uploadować pliku: ${file.originalname}`,
        );
      }
    }

    if (skippedFiles.length > 0) {
      this.logger.log(
        `⚠️ Skipped ${skippedFiles.length} invalid files: ${skippedFiles.join(', ')}`,
      );
    }

    this.logger.log(`✅ Successfully uploaded ${uploadedMedia.length} files`);
    return uploadedMedia;
  }

  async deleteMany(mediaIds: string[]): Promise<void> {
    if (!mediaIds?.length) return;

    const mediaList = await this.mediaRepo.find({
      where: { id: In(mediaIds) },
    });

    if (mediaList.length === 0) {
      this.logger.warn('No media found for deletion');
      return;
    }

    await Promise.all(
      mediaList.map(async (media) => {
        try {
          await this.minioService.deleteFile(media.storageKey);
        } catch (error) {
          this.logger.error(
            `Failed to delete file ${media.storageKey}:`,
            error instanceof Error ? error.stack : String(error),
          );
        }
      }),
    );

    await this.mediaRepo.delete(mediaIds);

    const contentIds = [...new Set(mediaList.map((m) => m.contentId))];

    for (const contentId of contentIds) {
      await this.reindexMedia(contentId);
    }

    this.logger.log(`🗑️ Deleted ${mediaList.length} media`);
  }

  async reorder(contentId: string, orderedMediaIds: string[]): Promise<void> {
    const allMedia = await this.mediaRepo.find({
      where: { contentId },
      order: { order: 'ASC' },
    });

    const mediaMap = new Map(allMedia.map((m) => [m.id, m]));
    const reorderedSet = new Set(orderedMediaIds);
    const updates: Media[] = [];

    orderedMediaIds.forEach((id, index) => {
      const media = mediaMap.get(id);
      if (media && media.order !== index) {
        media.order = index;
        updates.push(media);
      }
    });

    let nextOrder = orderedMediaIds.length;
    allMedia.forEach((media) => {
      if (!reorderedSet.has(media.id) && media.order !== nextOrder) {
        media.order = nextOrder;
        updates.push(media);
        nextOrder++;
      }
    });

    if (updates.length > 0) {
      await this.mediaRepo.save(updates);
      this.logger.log(`🔀 Reordered ${updates.length} media`);
    }
  }

  private isValidFileType(file: UploadedFileType): boolean {
    const allowedMimetypes = [
      ...this.ALLOWED_IMAGE_MIMETYPES,
      ...this.ALLOWED_VIDEO_MIMETYPES,
    ];

    return allowedMimetypes.includes(file.mimetype);
  }

  private generateAltText(filename: string): string {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    let alt = nameWithoutExt.replace(/[_-]/g, ' ');
    alt = alt.replace(/[^a-zA-Z0-9\s]/g, '');
    alt = alt.replace(/\s+/g, ' ').trim();
    if (alt.length > 0) {
      alt = alt.charAt(0).toUpperCase() + alt.slice(1);
    }

    return alt || 'Media';
  }

  private async uploadSingle(
    contentId: string,
    file: UploadedFileType,
    order: number,
  ): Promise<Media> {
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const storageKey = `${uuidv4()}-${Date.now()}.${ext}`;

    this.logger.log(`  → ${file.originalname} → ${storageKey}`);

    await this.minioService.uploadFile(file, storageKey);

    const type = file.mimetype.startsWith('video/')
      ? MediaType.VIDEO
      : MediaType.IMAGE;

    const altText = this.generateAltText(file.originalname);

    const media = this.mediaRepo.create({
      filename: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      type,
      size: file.size,
      alt: altText,
      contentId,
      order,
    });

    return await this.mediaRepo.save(media);
  }

  private async validateMediaLimit(
    contentId: string,
    newFilesCount: number,
    maxMedia: number,
  ): Promise<void> {
    const currentCount = await this.mediaRepo.count({
      where: { contentId },
    });

    if (currentCount + newFilesCount > maxMedia) {
      throw new BadRequestException(
        `Maksymalna liczba mediów: ${maxMedia}. ` +
          `Obecna: ${currentCount}, próbujesz dodać: ${newFilesCount}.`,
      );
    }
  }

  private async getNextOrder(contentId: string): Promise<number> {
    const lastMedia = await this.mediaRepo.findOne({
      where: { contentId },
      order: { order: 'DESC' },
    });

    return lastMedia ? lastMedia.order + 1 : 0;
  }

  private async reindexMedia(contentId: string): Promise<void> {
    const media = await this.mediaRepo.find({
      where: { contentId },
      order: { order: 'ASC' },
    });

    const updates = media
      .map((m, index) => {
        if (m.order !== index) {
          m.order = index;
          return m;
        }
        return null;
      })
      .filter((m): m is Media => m !== null);

    if (updates.length > 0) {
      await this.mediaRepo.save(updates);
      this.logger.log(
        `🔄 Reindexed ${updates.length} media for content ${contentId}`,
      );
    }
  }

  private async rollbackUploads(
    uploadedMedia: UploadedMediaInfo[],
  ): Promise<void> {
    if (!uploadedMedia.length) return;

    this.logger.warn(`🔄 Rolling back ${uploadedMedia.length} uploads...`);

    const mediaIds = uploadedMedia.map((m) => m.id);
    const mediaList = await this.mediaRepo.find({
      where: { id: In(mediaIds) },
    });

    await Promise.all(
      mediaList.map(async (media) => {
        try {
          await this.minioService.deleteFile(media.storageKey);
        } catch (error) {
          this.logger.error(
            `Rollback: failed to delete ${media.storageKey}`,
            error,
          );
        }
      }),
    );

    await this.mediaRepo.delete(mediaIds);
  }
}
