import { DataSource } from 'typeorm';
import { Product } from './src/modules/product/product.entity';
import * as dotenv from 'dotenv';
import { User } from './src/modules/user/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product, User],
  migrations: [
    process.env.NODE_ENV === 'prod'
      ? 'dist/migrations/*.js'
      : 'migrations/*.ts',
  ],
  synchronize: false,
  migrationsRun: false,
});
