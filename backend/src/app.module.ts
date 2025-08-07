import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { TestModule } from '../test/test-utils/test.module';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmConfigModule,
    ProductModule,
    ...(process.env.NODE_ENV === 'test' ? [TestModule] : []),
  ],
})
export class AppModule {}
