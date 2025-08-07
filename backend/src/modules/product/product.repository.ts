import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(data: Partial<Product>) {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async findAll() {
    return this.repo.find();
  }

  async deleteAll() {
    await this.repo.delete({});
  }
}
