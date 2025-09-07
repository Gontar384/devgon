import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../../modules/product/product.entity';
import { User } from '../../modules/user/user.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Product, User],
  synchronize: configService.get<string>('NODE_ENV') !== 'prod',
  migrationsRun: true,
});
