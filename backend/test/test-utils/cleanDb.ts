import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Product } from '../../src/modules/product/product.entity';

let dataSource: DataSource;

export const initDb = (app: INestApplication) => {
  dataSource = app.get<DataSource>(getDataSourceToken());
};

export const cleanDb = async () => {
  const productRepo = dataSource.getRepository(Product);
  await productRepo.clear();
};

export const disconnectDb = async () => {
  await dataSource.destroy();
};
