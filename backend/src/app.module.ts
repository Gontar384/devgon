import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { TestModule } from '../test/test-utils/test.module';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { GraphqlConfigModule } from './config/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmConfigModule,
    AuthModule,
    ProductModule,
    UserModule,
    ContentModule,
    GraphqlConfigModule,
    ...(process.env.NODE_ENV === 'testing' ? [TestModule] : []),
  ],
})
export class AppModule {}
