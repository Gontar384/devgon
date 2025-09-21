import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../../modules/product/product.entity';
import { User } from '../../modules/user/user.entity';
import { Content } from '../../modules/content/content.model';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Product, User, Content],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  migrationsRun: true,
});
