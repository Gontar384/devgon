import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './media.entity';
import { MinioService } from '../../../config/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadedMediaInfo {
  id: string;
  filename: string;
  type: MediaType;
  order: number;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Uploaduje wiele plików dla danego contentu
   * Waliduje limit i wykonuje upload atomowo
   */
  async uploadMany(
    contentId: string,
    files: UploadedFile[],
    maxMedia?: number,
  ): Promise<UploadedMediaInfo[]> {
    if (!files?.length) {
      throw new BadRequestException('Brak plików do uploadu');
    }

    this.logger.log(`📤 Uploading ${files.length} files for content ${contentId}`);

    // Walidacja limitu
    if (maxMedia !== undefined) {
      await this.validateMediaLimit(contentId, files.length, maxMedia);
    }

    // Pobierz następny order tylko raz
    const startOrder = await this.getNextOrder(contentId);

    // Upload wszystkich plików
    const uploadedMedia: UploadedMediaInfo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const order = startOrder + i;

      try {
        const media = await this.uploadSingle(contentId, file, order);
        uploadedMedia.push({
          id: media.id,
          filename: media.filename,
          type: media.type,
          order: media.order,
        });
      } catch (error) {
        // Rollback: usuń już uploadowane pliki
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

    this.logger.log(`✅ Successfully uploaded ${uploadedMedia.length} files`);
    return uploadedMedia;
  }

  /**
   * Usuwa media i przenumerowuje pozostałe
   */
  async delete(mediaId: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id: mediaId } });

    if (!media) {
      throw new BadRequestException('Media nie znaleziono');
    }

    // Usuń plik z MinIO
    try {
      await this.minioService.deleteFile(media.storageKey);
    } catch (error) {
      this.logger.error(
        `Failed to delete file ${media.storageKey}:`,
        error instanceof Error ? error.stack : String(error),
      );
      // Kontynuuj - usuń z DB nawet jeśli MinIO fail
    }

    const contentId = media.contentId;

    // Usuń z bazy
    await this.mediaRepo.delete({ id: mediaId });

    // Przenumeruj pozostałe
    await this.reindexMedia(contentId);

    this.logger.log(`🗑️ Deleted media ${mediaId}`);
  }

  /**
   * Usuwa wiele mediów jednocześnie (batch)
   */
  async deleteMany(mediaIds: string[]): Promise<void> {
    if (!mediaIds?.length) return;

    const mediaList = await this.mediaRepo.findByIds(mediaIds);

    if (mediaList.length === 0) {
      this.logger.warn('No media found for deletion');
      return;
    }

    // Usuń pliki z MinIO (równolegle)
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

    // Usuń z bazy
    await this.mediaRepo.delete(mediaIds);

    // Przenumeruj dla każdego contentu
    const contentIds = [...new Set(mediaList.map((m) => m.contentId))];

    for (const contentId of contentIds) {
      await this.reindexMedia(contentId);
    }

    this.logger.log(`🗑️ Deleted ${mediaList.length} media`);
  }

  /**
   * Zmienia kolejność mediów
   */
  async reorder(contentId: string, orderedMediaIds: string[]): Promise<void> {
    const allMedia = await this.mediaRepo.find({
      where: { contentId },
      order: { order: 'ASC' },
    });

    const mediaMap = new Map(allMedia.map((m) => [m.id, m]));
    const reorderedSet = new Set(orderedMediaIds);
    const updates: Media[] = [];

    // Ustaw nową kolejność dla wymienionych mediów
    orderedMediaIds.forEach((id, index) => {
      const media = mediaMap.get(id);
      if (media && media.order !== index) {
        media.order = index;
        updates.push(media);
      }
    });

    // Przesuń niewymienione media na koniec
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

  // ========== PRYWATNE METODY ==========

  /**
   * Uploaduje pojedynczy plik
   */
  private async uploadSingle(
    contentId: string,
    file: UploadedFile,
    order: number,
  ): Promise<Media> {
    // Generuj unikalny klucz
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const storageKey = `${uuidv4()}-${Date.now()}.${ext}`;

    this.logger.log(`  → ${file.originalname} → ${storageKey}`);

    // Upload do MinIO
    await this.minioService.uploadFile(file, storageKey);

    // Określ typ
    const type = file.mimetype.startsWith('video/')
      ? MediaType.VIDEO
      : MediaType.IMAGE;

    // Zapisz w bazie
    const media = this.mediaRepo.create({
      filename: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      type,
      size: file.size,
      contentId,
      order,
    });

    return await this.mediaRepo.save(media);
  }

  /**
   * Waliduje limit mediów
   */
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

  /**
   * Pobiera następny dostępny order
   */
  private async getNextOrder(contentId: string): Promise<number> {
    const lastMedia = await this.mediaRepo.findOne({
      where: { contentId },
      order: { order: 'DESC' },
    });

    return lastMedia ? lastMedia.order + 1 : 0;
  }

  /**
   * Przenumerowuje media (po usunięciu)
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
    }
  }

  /**
   * Rollback uploadów w przypadku błędu (usuwa już uploadowane pliki)
   */
  private async rollbackUploads(
    uploadedMedia: UploadedMediaInfo[],
  ): Promise<void> {
    if (!uploadedMedia.length) return;

    this.logger.warn(`🔄 Rolling back ${uploadedMedia.length} uploads...`);

    const mediaIds = uploadedMedia.map((m) => m.id);
    const mediaList = await this.mediaRepo.findByIds(mediaIds);

    // Usuń z MinIO
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

    // Usuń z DB
    await this.mediaRepo.delete(mediaIds);
  }
}