import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentInput } from './content.input';
import { MinioService } from '../../config/minio/minio.service';
import { MediaService } from './media/media.service';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    private readonly minioService: MinioService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Pobiera wszystkie contenty dla danego klucza wraz z podpisanymi URL mediów
   */
  async getMany(key: string): Promise<Content[]> {
    const contents = await this.contentRepo.find({
      where: { key },
      relations: ['media'],
      order: { order: 'ASC' },
    });

    // Generuj signed URLs dla wszystkich mediów
    await this.enrichMediaWithUrls(contents);

    return contents;
  }

  /**
   * Tworzy pusty content - NIE zwraca danych (klient zrobi revalidate)
   */
  async create(key: string): Promise<void> {
    this.logger.log(`📝 Creating empty content for key: ${key}`);

    const lastContent = await this.contentRepo.findOne({
      where: { key },
      order: { order: 'DESC' },
    });

    const content = this.contentRepo.create({
      key,
      order: lastContent ? lastContent.order + 1 : 0,
      title: null,
      header: null,
      description: null,
    });

    await this.contentRepo.save(content);
    this.logger.log(`✅ Empty content created`);
  }

  /**
   * Aktualizuje content - obsługuje tylko pola tekstowe i zarządzanie mediami
   * Upload nowych mediów odbywa się przez MediaController
   */
  async update(id: string, input: ContentInput): Promise<void> {
    this.logger.log(`🔄 Updating content ID: ${id}`);

    const content = await this.contentRepo.findOne({
      where: { id },
    });

    if (!content) {
      throw new BadRequestException('Content nie istnieje');
    }

    // 1. Aktualizuj pola tekstowe
    const updateData = this.normalizeInput(input);
    if (Object.keys(updateData).length > 0) {
      await this.contentRepo.update({ id }, updateData);
    }

    // 2. Usuń media (jeśli podano) - deleguj do MediaService
    if (input.deleteMediaIds?.length) {
      await this.mediaService.deleteMany(input.deleteMediaIds);
    }

    // 3. Zmień kolejność media (jeśli podano) - deleguj do MediaService
    if (input.existingMediaIds?.length) {
      await this.mediaService.reorder(id, input.existingMediaIds);
    }

    this.logger.log(`✅ Content updated`);
  }

  /**
   * Usuwa content wraz z powiązanymi mediami i plikami
   */
  async delete(id: string): Promise<boolean> {
    const content = await this.contentRepo.findOne({
      where: { id },
      relations: ['media'],
    });

    if (!content) {
      return false;
    }

    // Usuń wszystkie media (MediaService zajmie się plikami)
    if (content.media?.length) {
      const mediaIds = content.media.map((m) => m.id);
      await this.mediaService.deleteMany(mediaIds);
    }

    // Usuń content z DB (cascade może już być ustawiony, ale lepiej być pewnym)
    await this.contentRepo.delete({ id });

    // Przenumeruj pozostałe contenty
    await this.reindexContents(content.key);

    this.logger.log(`✅ Content ${id} deleted`);
    return true;
  }

  /**
   * Zmienia kolejność contentów
   */
  async reorder(key: string, ids: string[]): Promise<boolean> {
    const contents = await this.contentRepo.find({ where: { key } });
    const contentMap = new Map(contents.map((c) => [c.id, c]));

    const updates: Content[] = [];

    ids.forEach((id, index) => {
      const content = contentMap.get(id);
      if (content && content.order !== index) {
        content.order = index;
        updates.push(content);
      }
    });

    if (updates.length > 0) {
      await this.contentRepo.save(updates);
      this.logger.log(`✅ Reordered ${updates.length} contents`);
    }

    return true;
  }

  // ========== PRYWATNE POMOCNICZE METODY ==========

  /**
   * Generuje signed URLs dla wszystkich mediów w contentach
   */
  private async enrichMediaWithUrls(contents: Content[]): Promise<void> {
    for (const content of contents) {
      if (!content.media?.length) continue;

      for (const media of content.media) {
        // TypeScript workaround: Media entity nie ma 'url', ale GraphQL Model tak
        Object.assign(media, {
          url: await this.minioService.getSignedUrl(media.storageKey),
        });
      }
    }
  }

  /**
   * Przenumerowuje contenty (po usunięciu)
   */
  private async reindexContents(key: string): Promise<void> {
    const contents = await this.contentRepo.find({
      where: { key },
      order: { order: 'ASC' },
    });

    const updates = contents
      .map((c, index) => {
        if (c.order !== index) {
          c.order = index;
          return c;
        }
        return null;
      })
      .filter((c): c is Content => c !== null);

    if (updates.length > 0) {
      await this.contentRepo.save(updates);
    }
  }

  /**
   * Normalizuje input - usuwa puste stringi i trimuje
   */
  private normalizeInput(input: ContentInput): DeepPartial<Content> {
    const data: DeepPartial<Content> = {};

    if (input.title !== undefined) {
      data.title = input.title?.trim() || null;
    }
    if (input.header !== undefined) {
      data.header = input.header?.trim() || null;
    }
    if (input.description !== undefined) {
      data.description = input.description?.trim() || null;
    }

    return data;
  }
}
