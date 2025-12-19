import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentInput } from './content.input';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
  ) {}

  async getManyByKeys(keys: string[]) {
    const contents = await this.repo.find({
      where: { key: In(keys) },
      order: { order: 'ASC' },
    });

    const grouped = new Map<string, Content[]>();

    for (const key of keys) {
      grouped.set(key, []);
    }

    for (const content of contents) {
      grouped.get(content.key)?.push(content);
    }

    return Array.from(grouped.entries()).map(([key, items]) => ({
      key,
      items,
    }));
  }

  //SINGLE CONTENT
  async getByKey(key: string) {
    return await this.repo.findOne({ where: { key } });
  }

  async upsertByKey(key: string, input: ContentInput) {
    let content = await this.repo.findOne({ where: { key } });

    if (!content) {
      content = this.repo.create({ key, ...input });
    } else {
      Object.assign(content, input);
    }

    return await this.repo.save(content);
  }

  //MULTIPLE CONTENT
  async getById(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  async getMany(key: string) {
    return await this.repo.find({
      where: { key },
      order: { order: 'ASC' },
    });
  }

  async create(key: string, input: ContentInput) {
    const content = this.repo.create({ key, ...input });
    return await this.repo.save(content);
  }

  async update(id: string, input: ContentInput) {
    await this.repo.update({ id }, input);
    return await this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.repo.delete({ id });
    return true;
  }

  async reorder(key: string, ids: string[]) {
    const contents = await this.getMany(key);

    ids.forEach((id, index) => {
      const item = contents.find((c) => c.id === id);
      if (item) {
        item.order = index;
      }
    });

    await this.repo.save(contents);
    return true;
  }
}
