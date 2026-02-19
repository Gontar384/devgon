import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Media } from './media.entity';
import { MinioService } from '../../../config/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';
import { MediaType, UploadedFileType, UploadedMediaItem } from './media-types';

/**
 * Service responsible for uploading, managing, and deleting media files
 * attached to content blocks.
 *
 * Files are stored in MinIO under a UUID-based storage key. Each uploaded
 * file is temporarily identified by a client-generated `tempId`, which is
 * later resolved to a real database ID when the parent content is saved.
 *
 * Supported file types:
 * - Images: JPEG, PNG, GIF, WebP, SVG
 * - Videos: MP4, MPEG, QuickTime, AVI, WebM
 *
 * Max file size is enforced at the controller level (50 MB per file).
 */
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

  /**
   * Uploads multiple files to MinIO and persists their metadata to the database.
   * Each file must have a corresponding client-generated `tempId` at the same index.
   *
   * Files with unsupported MIME types are silently skipped (logged as warnings).
   * If any individual upload fails, all previously uploaded files in the batch
   * are rolled back (deleted from both MinIO and the database).
   *
   * @param contentId - ID of the content block these media files belong to
   * @param files - Array of uploaded files (from Multer)
   * @param tempIds - Client-generated temporary IDs matched by index to `files`
   * @returns Array of uploaded media items with their resolved IDs and tempIds
   * @throws BadRequestException if no files are provided, counts mismatch, or upload fails
   */
  async uploadMany(
    contentId: string,
    files: UploadedFileType[],
    tempIds: string[],
  ): Promise<Array<UploadedMediaItem>> {
    if (!files?.length) {
      throw new BadRequestException('No files to upload');
    }
    if (files.length !== tempIds.length) {
      throw new BadRequestException(
        `Mismatch: ${files.length} files, ${tempIds.length} tempIds`,
      );
    }

    this.logger.log(
      `📤 Uploading ${files.length} files for content ${contentId}`,
    );

    const uploadedMedia: Array<UploadedMediaItem> = [];
    const skippedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = tempIds[i];

      if (!this.isValidFileType(file)) {
        this.logger.warn(
          `⚠️ Skipping invalid file type: ${file.originalname} (${file.mimetype})`,
        );
        skippedFiles.push(file.originalname);
        continue;
      }

      try {
        const media = await this.uploadSingleWithTempId(
          contentId,
          file,
          tempId,
        );

        uploadedMedia.push({
          id: media.id,
          tempId: media.uploadTempId!,
          filename: media.filename,
          type: media.type,
          order: media.order,
        });
      } catch (error) {
        await this.rollbackUploads(uploadedMedia.map((m) => m.id));
        this.logger.error(
          `Upload failed for ${file.originalname}:`,
          error instanceof Error ? error.stack : String(error),
        );
        throw new BadRequestException(
          `Could not upload file: ${file.originalname}`,
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

  /**
   * Uploads a single file to MinIO and saves its metadata record in the database.
   * The storage key is generated as `{uuid}-{timestamp}.{ext}` to ensure uniqueness.
   * Media type (IMAGE or VIDEO) is inferred from the file's MIME type.
   * Alt text is auto-generated from the filename via `generateAltText`.
   *
   * @param contentId - ID of the parent content block
   * @param file - The file to upload
   * @param tempId - Client-generated temporary ID to associate with this upload
   * @returns The saved Media entity
   */
  private async uploadSingleWithTempId(
    contentId: string,
    file: UploadedFileType,
    tempId: string,
  ): Promise<Media> {
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const storageKey = `${uuidv4()}-${Date.now()}.${ext}`;

    this.logger.log(
      `  → ${file.originalname} (tempId: ${tempId}) → ${storageKey}`,
    );

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
      order: 0,
      uploadTempId: tempId,
    });

    return await this.mediaRepo.save(media);
  }

  /**
   * Finds a media record by its temporary upload ID.
   * Used during content update to resolve `tempId` references into real DB IDs.
   *
   * @param tempId - The client-generated temporary identifier
   * @returns The matching Media entity, or `null` if not found
   */
  async findByTempId(tempId: string): Promise<Media | null> {
    return await this.mediaRepo.findOne({
      where: { uploadTempId: tempId },
    });
  }

  /**
   * Deletes multiple media records by ID.
   * For each record, the corresponding file is removed from MinIO first.
   * MinIO errors are caught and logged individually to avoid blocking the DB deletion.
   * After deletion, media order is reindexed for each affected content block.
   *
   * @param mediaIds - Array of media IDs to delete
   */
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

  /**
   * Checks whether a file's MIME type is in the list of allowed image or video types.
   *
   * @param file - The uploaded file to validate
   * @returns `true` if the MIME type is allowed, `false` otherwise
   */
  private isValidFileType(file: UploadedFileType): boolean {
    const allowedMimetypes = [
      ...this.ALLOWED_IMAGE_MIMETYPES,
      ...this.ALLOWED_VIDEO_MIMETYPES,
    ];

    return allowedMimetypes.includes(file.mimetype);
  }

  /**
   * Generates a human-readable alt text string from a filename.
   * Strips the file extension, replaces underscores and hyphens with spaces,
   * removes non-alphanumeric characters, normalizes whitespace,
   * and capitalizes the first letter.
   * Falls back to `"Media"` if the result is empty.
   *
   * @param filename - Original filename (e.g. "my_photo-01.jpg")
   * @returns Sanitized alt text string (e.g. "My photo 01")
   */
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

  /**
   * Restores a contiguous `order` sequence (0, 1, 2, ...) for all media
   * belonging to a given content block. Called automatically after media deletion.
   * Only records with a changed order value are written to the database.
   *
   * @param contentId - ID of the content block whose media should be reindexed
   */
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

  /**
   * Removes a set of recently uploaded media files as part of an error recovery flow.
   * Deletes each file from MinIO first, then removes the database records.
   * Individual MinIO errors are caught and logged without interrupting the rollback.
   *
   * @param mediaIds - IDs of media records to roll back
   */
  async rollbackUploads(mediaIds: string[]): Promise<void> {
    if (!mediaIds.length) return;

    this.logger.warn(`🔄 Rolling back ${mediaIds.length} uploads...`);

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

    this.logger.log(`✅ Rollback complete: deleted ${mediaIds.length} media`);
  }

  /**
   * Updates the `order` field for a set of media records within a single transaction.
   *
   * To avoid unique constraint conflicts during reordering, orders are first set
   * to large negative temporary values (`-1000 - index`), then updated to their
   * final values in a second pass. This two-phase approach prevents collisions
   * when swapping adjacent order values.
   *
   * @param updates - Array of `{ id, order }` pairs to apply
   * @throws BadRequestException if any of the provided IDs cannot be found
   */
  async updateOrder(
    updates: Array<{ id: string; order: number }>,
  ): Promise<void> {
    if (!updates.length) return;

    await this.mediaRepo.manager.transaction(async (manager) => {
      const mediaRepo = manager.getRepository(Media);

      const mediaList = await mediaRepo.find({
        where: { id: In(updates.map((u) => u.id)) },
      });

      if (mediaList.length !== updates.length) {
        const foundIds = new Set(mediaList.map((m) => m.id));
        const missingIds = updates
          .filter((u) => !foundIds.has(u.id))
          .map((u) => u.id);
        throw new BadRequestException(
          `Media not found for IDs: ${missingIds.join(', ')}`,
        );
      }

      const mediaMap = new Map(mediaList.map((m) => [m.id, m]));

      await mediaRepo.save(
        updates.map(({ id }, idx) => ({
          ...mediaMap.get(id)!,
          order: -1000 - idx,
        })),
      );

      await mediaRepo.save(
        updates.map(({ id, order }) => ({
          ...mediaMap.get(id)!,
          order,
        })),
      );

      this.logger.log(`🔀 Updated order for ${updates.length} media`);
    });
  }

  /**
   * Clears the `uploadTempId` field for a set of media records.
   * Called after a successful content update to mark temporary IDs as consumed,
   * preventing them from being resolved again in future requests.
   *
   * @param mediaIds - IDs of media records whose tempId should be nullified
   */
  async clearTempIds(mediaIds: string[]): Promise<void> {
    if (!mediaIds.length) return;

    await this.mediaRepo.update({ id: In(mediaIds) }, { uploadTempId: null });

    this.logger.log(`🧹 Cleared tempIds for ${mediaIds.length} media`);
  }
}
