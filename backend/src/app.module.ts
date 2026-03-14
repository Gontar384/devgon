import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/cms/content/content.module';
import { GraphqlConfigModule } from './config/graphql/graphql.module';
import { HealthModule } from '../test/healthcheck/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmConfigModule,
    AuthModule,
    UserModule,
    ContentModule,
    GraphqlConfigModule,
    HealthModule,
  ],
})
export class AppModule {}
