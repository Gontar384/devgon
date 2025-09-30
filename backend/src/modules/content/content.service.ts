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

  async getAllByKey(key: string): Promise<Content[]> {
    return this.repo.find({ where: { key } });
  }

  async getByKey(key: string): Promise<Content | null> {
    return this.repo.findOne({ where: { key } });
  }

  async upsert(key: string, input: ContentInput): Promise<Content> {
    let content = await this.repo.findOne({ where: { key } });
    if (!content) {
      content = this.repo.create({ key, ...input });
    } else {
      Object.assign(content, input);
    }
    return this.repo.save(content);
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
