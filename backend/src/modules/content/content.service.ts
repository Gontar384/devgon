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

  async getMany(key: string): Promise<Content[]> {
    const contents = await this.contentRepo.find({
      where: { key },
      relations: ['media'],
      order: { order: 'ASC' },
    });

    await this.enrichMediaWithUrls(contents);

    return contents;
  }

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





  async update(id: string, input: ContentInput): Promise<void> {
    this.logger.log(`🔄 Updating content ID: ${id}`);

    await this.contentRepo.manager.transaction(async (manager) => {
      const contentRepo = manager.getRepository(Content);

      const content = await contentRepo.findOne({
        where: { id },
        relations: ['media'],
      });

      if (!content) {
        throw new BadRequestException('Content nie istnieje');
      }

      const updateData = this.normalizeInput(input);
      if (Object.keys(updateData).length > 0) {
        await contentRepo.update({ id }, updateData);
      }

      const mediaOrderMap = new Map<string, number>();

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
        }

        if (mediaId) {
          mediaOrderMap.set(mediaId, item.order);
        }
      }

      const currentMediaIds = content.media.map((m) => m.id);
      const toDelete = currentMediaIds.filter((mediaId) => !mediaOrderMap.has(mediaId));

      if (toDelete.length > 0) {
        this.logger.log(`🗑️ Deleting ${toDelete.length} media`);
        await this.mediaService.deleteMany(toDelete);
      }

      const updates = Array.from(mediaOrderMap.entries()).map(([mediaId, order]) => ({
        id: mediaId,
        order,
      }));

      if (updates.length > 0) {
        await this.mediaService.updateOrder(updates);
        await this.mediaService.clearTempIds(updates.map((u) => u.id));
      }

      this.logger.log(`✅ Content updated with ${updates.length} media`);
    });
  }






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

  private async enrichMediaWithUrls(contents: Content[]): Promise<void> {
    for (const content of contents) {
      if (!content.media?.length) continue;

      for (const media of content.media) {
        Object.assign(media, {
          url: await this.minioService.getSignedUrl(media.storageKey),
        });
      }
    }
  }

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
