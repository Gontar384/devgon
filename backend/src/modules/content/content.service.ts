import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.model';
import { UpsertContentInput } from './content.input';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
  ) {}

  async getAll(): Promise<Content[]> {
    return this.repo.find();
  }

  async getByKey(key: string): Promise<Content | null> {
    return this.repo.findOne({ where: { key } });
  }

  async upsert(key: string, input: UpsertContentInput): Promise<Content> {
    let content = await this.repo.findOne({ where: { key } });
    if (!content) {
      content = this.repo.create({ key, ...input });
    } else {
      Object.assign(content, input);
    }
    return this.repo.save(content);
  }
}
