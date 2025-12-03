import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentInput } from './content.input';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
  ) {}

  async getByKey(key: string): Promise<Content | null> {
    return this.repo.findOne({ where: { key } });
  }

  async getAllByKey(key: string): Promise<Content[]> {
    return this.repo.find({ where: { key } });
  }

  async upsert(key: string, input: ContentInput): Promise<Content> {
    let content = await this.repo.findOne({ where: { key } });
    if (!content) {
      content = this.repo.create({ key, ...input });
    } else {
      Object.assign(content, {
        ...input,
        key: content.key,
      });
    }

    console.log('Upsert returned:', content);
    return this.repo.save(content);
  }

  async create(key: string, input: ContentInput): Promise<Content> {
    const count = await this.repo.count({ where: { key } });
    const content = this.repo.create({
      key,
      order: count,
      ...input,
    });
    return this.repo.save(content);
  }

  async reorder(key: string, orderedIds: string[]): Promise<Content[]> {
    const contents = await this.repo.find({ where: { key } });

    const updated = contents.map((c) => {
      const newOrder = orderedIds.indexOf(c.id);
      if (newOrder !== -1) c.order = newOrder;
      return c;
    });

    await this.repo.save(updated);
    return updated.sort((a, b) => a.order - b.order);
  }

  async addImage(key: string, imageUrl: string): Promise<Content> {
    let content = await this.repo.findOne({ where: { key } });
    if (!content) {
      content = this.repo.create({ key, images: [imageUrl] });
    } else {
      content.images = [...(content.images || []), imageUrl];
    }
    return this.repo.save(content);
  }

  async removeImage(key: string, index: number): Promise<Content | null> {
    const content = await this.repo.findOne({ where: { key } });
    if (!content || !content.images?.length) return null;
    content.images.splice(index, 1);
    return this.repo.save(content);
  }

  async setVideo(key: string, videoUrl: string): Promise<Content> {
    let content = await this.repo.findOne({ where: { key } });
    if (!content) {
      content = this.repo.create({ key, video: videoUrl });
    } else {
      content.video = videoUrl;
    }
    return this.repo.save(content);
  }
}
