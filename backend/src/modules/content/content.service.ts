import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
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
    const normalized = this.normalizeInput(input);
    let content = await this.repo.findOne({ where: { key } });

    if (!content) {
      content = this.repo.create({
        key,
        ...normalized,
      });
    } else {
      Object.assign(content, normalized);
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
    const normalized = this.normalizeInput(input);

    const last = await this.repo.findOne({
      where: { key },
      order: { order: 'DESC' },
    });

    const nextOrder = last ? last.order + 1 : 0;

    const content = this.repo.create({
      key,
      order: nextOrder,
      ...normalized,
    });

    return await this.repo.save(content);
  }

  async update(id: string, input: ContentInput) {
    const normalized = this.normalizeInput(input);

    await this.repo.update({ id }, normalized);
    return await this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) return false;

    await this.repo.delete({ id });

    const contents = await this.repo.find({
      where: { key: item.key },
      order: { order: 'ASC' },
    });

    contents.forEach((c, index) => {
      c.order = index;
    });

    await this.repo.save(contents);

    return true;
  }

  async reorder(key: string, ids: string[]) {
    const contents = await this.repo.find({
      where: { key },
    });

    const map = new Map(contents.map((c) => [c.id, c]));

    ids.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        item.order = index;
      }
    });

    await this.repo.save([...map.values()]);
    return true;
  }

  normalizeInput(input: ContentInput): DeepPartial<Content> {
    const normalized: DeepPartial<Content> = {
      title: input.title?.trim() || null,
      header: input.header?.trim() || null,
      description: input.description?.trim() || null,
      images: input.images,
      video: input.video,
    };

    if (input.order !== undefined && input.order !== null) {
      normalized.order = input.order;
    }

    return normalized;
  }
}
