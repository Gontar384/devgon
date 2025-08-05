import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../src/modules/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [TestController],
})
export class TestModule {}
