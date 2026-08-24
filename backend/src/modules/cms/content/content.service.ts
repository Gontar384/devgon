import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentInput } from './content.input';
import { MinioService } from '../../../config/minio/minio.service';
import { MediaService } from './media/media.service';
import * as sanitizeHtml from 'sanitize-html';

/**
 * Service responsible for managing CMS content blocks.
 *
 * Each content block is scoped to a named `key` that represents a specific
 * section of the page (e.g. "hero", "about-us", "team"). Multiple blocks
 * can exist under the same key and are displayed in ascending `order`.
 *
 * In addition to basic text fields (title, subtitle, description),
 * each block can store arbitrary structured data in the `customData` JSON column.
 * This allows different sections to define their own schema without
 * requiring database migrations.
 *
 * This service handles the full lifecycle of content blocks:
 * creation, update (including media management), deletion, and reordering.
 * Media files are stored in MinIO object storage and referenced via public URLs.
 */
@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    private readonly mediaService: MediaService,
    private readonly minioService: MinioService,
  ) {}

  /**
   * Retrieves all content blocks for a given page section key,
   * sorted by `order` ascending. Related media are also sorted
   * by `order` and enriched with public MinIO URLs before returning.
   *
   * @param key - The page section identifier (e.g. "hero", "team")
   * @returns Ordered list of content blocks with hydrated media URLs
   */
  async getMany(key: string): Promise<Content[]> {
    const contents = await this.contentRepo.find({
      where: { key },
      relations: ['media'],
      order: {
        order: 'ASC',
        media: { order: 'ASC' },
      },
    });

    this.enrichMediaWithUrls(contents);

    return contents;
  }

  /**
   * Creates a new empty content block for a given page section key.
   * The new block is appended at the end of the existing list —
   * its `order` is set to `lastBlock.order + 1`, or `0` if none exist yet.
   * All fields (title, subtitle, description and `customData`) are initialized to `null`.
   *
   * @param key - The page section identifier to create the block under
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
      subtitle: null,
      description: null,
      customData: null,
    });

    await this.contentRepo.save(content);
    this.logger.log(`✅ Empty content created`);
  }

  /**
   * Updates an existing content block by ID.
   *
   * This method handles four concerns in sequence:
   * 1. **Text and structured fields** — `title`, `subtitle`, `description`,
   *    and the optional `customData` JSON field are normalized and persisted
   *    if present in the input (undefined fields are skipped).
   *    Text fields are trimmed and sanitized to remove disallowed HTML.
   *    The `customData` field may contain arbitrary structured JSON defined
   *    by the frontend and is stored as-is.
   * 2. **Media reconciliation** — the incoming `mediaOrder` list is compared
   *    against the current media. New media are resolved from their `tempId`
   *    (set during upload), removed media are deleted from storage and DB,
   *    and the final order is persisted transactionally.
   * 3. **Media limit enforcement** — if `maxMedia` is provided and the
   *    resulting media count exceeds it, newly uploaded files are rolled back
   *    and a `BadRequestException` is thrown.
   * 4. **Media order persistence** — the final media order is written to the
   *    database and any temporary upload identifiers are cleared.
   *
   * @param id - ID of the content block to update
   * @param input - Updated optional text fields, JSON `customData` and desired media order
   * @param maxMedia - Optional cap on the number of allowed media files
   * @throws BadRequestException if the content is not found,
   *   a tempId cannot be resolved, or the media limit is exceeded
   */
  async update(
    id: string,
    input: ContentInput,
    maxMedia?: number,
  ): Promise<void> {
    this.logger.log(`🔄 Updating content ID: ${id}`);

    const content = await this.contentRepo.findOne({
      where: { id },
      relations: ['media'],
      order: { media: { order: 'ASC' } },
    });

    if (!content) {
      throw new BadRequestException('Content not found');
    }

    const updateData = this.normalizeInput(input);
    if (Object.keys(updateData).length > 0) {
      await this.contentRepo.update({ id }, updateData);
    }

    const mediaOrderMap = new Map<string, number>();
    const newMediaIds: string[] = [];

    for (const item of input.mediaOrder) {
      let mediaId: string | null = null;

      if (item.kind === 'existing' && item.id) {
        mediaId = item.id;
      } else if (item.kind === 'new' && item.tempId) {
        const media = await this.mediaService.findByTempId(item.tempId);
        if (!media) {
          this.logger.error(`❌ Media not found for tempId: ${item.tempId}`);
          throw new BadRequestException(
            `Uploaded media not found for tempId: ${item.tempId}`,
          );
        }
        mediaId = media.id;
        newMediaIds.push(media.id);
      }

      if (mediaId) {
        mediaOrderMap.set(mediaId, item.order);
      }
    }

    const currentMediaIds = content.media.map((m) => m.id);
    const toDelete = currentMediaIds.filter(
      (mediaId) => !mediaOrderMap.has(mediaId),
    );

    if (toDelete.length > 0) {
      this.logger.log(`🗑️ Deleting ${toDelete.length} media`);
      await this.mediaService.deleteMany(toDelete);
    }

    const updates = Array.from(mediaOrderMap.entries()).map(
      ([mediaId, order]) => ({
        id: mediaId,
        order,
      }),
    );

    if (maxMedia != null) {
      const finalMediaCount = mediaOrderMap.size;

      if (finalMediaCount > maxMedia) {
        this.logger.error(
          `❌ Media limit exceeded: ${finalMediaCount} > ${maxMedia}`,
        );

        if (newMediaIds.length > 0) {
          this.logger.warn(
            `🔄 Rolling back ${newMediaIds.length} newly uploaded media...`,
          );
          await this.mediaService.rollbackUploads(newMediaIds);
        }

        throw new BadRequestException(
          `You've exceeded ${maxMedia} media file(s) allowed `,
        );
      }
    }

    if (updates.length > 0) {
      await this.mediaService.updateOrder(updates);
      if (newMediaIds.length > 0) {
        await this.mediaService.clearTempIds(newMediaIds);
      }
    }

    this.logger.log(`✅ Content updated with ${updates.length} media`);
  }

  /**
   * Deletes a content block and all its associated media files.
   * After deletion, remaining blocks under the same key are reindexed
   * to maintain a contiguous `order` sequence starting from 0.
   *
   * @param id - ID of the content block to delete
   * @returns `true` if deleted successfully, `false` if not found
   */
  async delete(id: string): Promise<boolean> {
    const content = await this.contentRepo.findOne({
      where: { id },
      relations: ['media'],
    });

    if (!content) {
      return false;
    }

    if (content.media?.length) {
      const mediaIds = content.media.map((m) => m.id);
      await this.mediaService.deleteMany(mediaIds);
    }

    await this.contentRepo.delete({ id });

    await this.reindexContents(content.key);

    this.logger.log(`✅ Content ${id} deleted`);
    return true;
  }

  /**
   * Reorders content blocks under a given key based on a provided ID list.
   * Each block's `order` is set to its index position in the `ids` array.
   * Only blocks whose order has actually changed are updated in the database.
   *
   * @param key - The page section identifier
   * @param ids - Ordered array of content block IDs representing the new sequence
   * @returns `true` when reordering is complete
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

  /**
   * Mutates each media object in place by attaching its public MinIO URL.
   * Called before returning data to the client.
   * Skips content blocks that have no associated media.
   *
   * @param contents - List of content blocks whose media should be enriched
   */
  private enrichMediaWithUrls(contents: Content[]): void {
    for (const content of contents) {
      if (!content.media?.length) continue;

      for (const media of content.media) {
        Object.assign(media, {
          url: this.minioService.getPublicUrl(media.storageKey),
        });
      }
    }
  }

  /**
   * Restores a contiguous `order` sequence (0, 1, 2, ...) for all content
   * blocks under a given key. Called automatically after a block is deleted.
   * Only blocks with a changed order value are written to the database.
   *
   * @param key - The page section identifier to reindex
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
      this.logger.log(`🔄 Reindexed ${updates.length} contents for key ${key}`);
    }
  }

  /**
   * Builds a sanitized update object from a raw `ContentInput`.
   * Only fields explicitly present in the input are included.
   * String values are trimmed and sanitized via sanitize-html to strip
   * disallowed tags and attributes. Empty strings are coerced to `null`.
   * The optional `customData` JSON field is passed through as-is and may contain
   * arbitrary structured data defined by the frontend.
   *
   * @param input - Raw input from the GraphQL mutation
   * @returns Partial entity object safe to pass to `contentRepo.update()`
   */
  private normalizeInput(input: ContentInput): DeepPartial<Content> {
    const data: DeepPartial<Content> = {};

    const sanitize = (html: string, options: sanitizeHtml.IOptions) =>
      sanitizeHtml(html.trim(), options) || null;

    if (input.title !== undefined) {
      data.title = input.title
        ? sanitize(input.title, SMALL_SANITIZE_OPTIONS)
        : null;
    }
    if (input.subtitle !== undefined) {
      data.subtitle = input.subtitle
        ? sanitize(input.subtitle, SMALL_SANITIZE_OPTIONS)
        : null;
    }
    if (input.description !== undefined) {
      data.description = input.description
        ? sanitize(input.description, BIG_SANITIZE_OPTIONS)
        : null;
    }
    if (input.customData !== undefined) {
      data.customData = input.customData ?? null;
    }

    return data;
  }
}

const SMALL_SANITIZE_OPTIONS = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 's', 'a'],
  allowedAttributes: { a: ['href', 'target', 'rel', 'class'] },
};

const BIG_SANITIZE_OPTIONS = {
  ...SMALL_SANITIZE_OPTIONS,
  allowedTags: [
    ...SMALL_SANITIZE_OPTIONS.allowedTags,
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
  ],
};
