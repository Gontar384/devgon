import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentInput } from './content.input';
import { Media, MediaType } from './media/media.entity';
import { MinioService } from '../../config/minio/minio.service';
import { FileUpload } from 'graphql-upload-minimal';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly minioService: MinioService,
  ) {}

  async getMany(key: string) {
    return await this.contentRepo.find({
      where: { key },
      relations: ['media'],
      order: { order: 'ASC' },
    });
  }

  async create(key: string, input: ContentInput) {
    const normalized = this.normalizeInput(input);

    const last = await this.contentRepo.findOne({
      where: { key },
      order: { order: 'DESC' },
    });

    const nextOrder = last ? last.order + 1 : 0;

    const content = this.contentRepo.create({
      key,
      order: nextOrder,
      ...normalized,
    });

    const savedContent = await this.contentRepo.save(content);

    if (input.newMedia && input.newMedia.length > 0) {
      await this.uploadMediaFiles(savedContent.id, input.newMedia);
    }

    return await this.contentRepo.findOne({
      where: { id: savedContent.id },
      relations: ['media'],
    });
  }

  async update(id: string, input: ContentInput) {
    const normalized = this.normalizeInput(input);

    await this.contentRepo.update({ id }, normalized);

    if (input.deleteMediaIds && input.deleteMediaIds.length > 0) {
      for (const mediaId of input.deleteMediaIds) {
        await this.deleteMedia(mediaId);
      }
    }

    if (input.newMedia && input.newMedia.length > 0) {
      await this.uploadMediaFiles(id, input.newMedia);
    }

    if (input.existingMediaIds && input.existingMediaIds.length > 0) {
      await this.reorderMedia(id, input.existingMediaIds);
    }

    return await this.contentRepo.findOne({
      where: { id },
      relations: ['media'],
    });
  }

  async delete(id: string) {
    const item = await this.contentRepo.findOne({
      where: { id },
      relations: ['media'],
    });
    if (!item) return false;

    for (const media of item.media) {
      await this.minioService.deleteFile(media.storageKey);
    }

    await this.contentRepo.delete({ id });

    const contents = await this.contentRepo.find({
      where: { key: item.key },
      order: { order: 'ASC' },
    });

    contents.forEach((c, index) => {
      c.order = index;
    });

    await this.contentRepo.save(contents);
    return true;
  }

  async reorder(key: string, ids: string[]) {
    const contents = await this.contentRepo.find({
      where: { key },
    });
    const map = new Map(contents.map((c) => [c.id, c]));

    const toSave: Content[] = [];

    ids.forEach((id, index) => {
      const item = map.get(id);
      if (item && item.order !== index) {
        item.order = index;
        toSave.push(item);
      }
    });

    if (toSave.length > 0) {
      await this.contentRepo.save(toSave);
    }
    return true;
  }

  private async uploadMediaFiles(
    contentId: string,
    files: FileUpload[],
  ): Promise<void> {
    for (const fileUpload of files) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { createReadStream, filename, mimetype } = fileUpload;

      const stream = createReadStream();
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
      }

      const buffer = Buffer.concat(chunks);

      const ext = filename.split('.').pop() ?? 'bin';
      const storageKey = `${uuidv4()}-${Date.now()}.${ext}`;

      await this.minioService.uploadFile(
        {
          buffer,
          originalname: filename,
          mimetype,
          size: buffer.length,
        },
        storageKey,
      );

      const type = mimetype.startsWith('video/')
        ? MediaType.VIDEO
        : MediaType.IMAGE;

      const lastMedia = await this.mediaRepo.findOne({
        where: { contentId },
        order: { order: 'DESC' },
      });
      const nextOrder = lastMedia ? lastMedia.order + 1 : 0;

      const media = this.mediaRepo.create({
        filename,
        storageKey,
        mimeType: mimetype,
        type,
        size: buffer.length,
        contentId,
        order: nextOrder,
      });

      await this.mediaRepo.save(media);
    }
  }

  private async deleteMedia(mediaId: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id: mediaId } });
    if (!media) return;

    await this.minioService.deleteFile(media.storageKey);

    await this.mediaRepo.delete({ id: mediaId });

    const remainingMedia = await this.mediaRepo.find({
      where: { contentId: media.contentId },
      order: { order: 'ASC' },
    });

    remainingMedia.forEach((m, index) => {
      m.order = index;
    });

    await this.mediaRepo.save(remainingMedia);
  }

  private async reorderMedia(
    contentId: string,
    mediaIds: string[],
  ): Promise<void> {
    const media = await this.mediaRepo.find({ where: { contentId } });
    const map = new Map(media.map((m) => [m.id, m]));

    const toSave: Media[] = [];

    mediaIds.forEach((id, index) => {
      const item = map.get(id);
      if (item && item.order !== index) {
        item.order = index;
        toSave.push(item);
      }
    });

    if (toSave.length > 0) {
      await this.mediaRepo.save(toSave);
    }
  }

  normalizeInput(input: ContentInput): DeepPartial<Content> {
    return {
      title: input.title?.trim() || null,
      header: input.header?.trim() || null,
      description: input.description?.trim() || null,
    };
  }
}
