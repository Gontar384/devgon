import { Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../src/modules/product/product.entity';

@Controller('test-utils')
export class TestController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  @Post('reset-db')
  async resetDatabase() {
    await this.productRepo.clear();
    return { message: 'Database reset' };
  }
}
