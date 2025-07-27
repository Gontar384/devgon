import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(title: string, description?: string) {
    return this.productRepository.create({ title, description });
  }

  async findAll() {
    return this.productRepository.findAll();
  }
}
