import { DataSource } from 'typeorm';
import { Product } from './src/modules/product/product.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product],
  migrations: ['./migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
});
