import { DataSource } from 'typeorm';
import { Product } from './src/modules/product/product.entity';
import * as dotenv from 'dotenv';
import { User } from './src/modules/user/user.entity';
import { Content } from './src/modules/content/content.model';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product, User, Content],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'migrations/*.ts',
  ],
  synchronize: false,
  migrationsRun: false,
});
