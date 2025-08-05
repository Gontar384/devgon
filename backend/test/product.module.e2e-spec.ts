import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { cleanDb, disconnectDb, initDb } from './test-utils/cleanDb';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    initDb(app);
  });

  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await disconnectDb();
    await app.close();
  });

  it('/products (GET) should return array', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products (POST) should create and return a product', () => {
    const newProduct = {
      title: 'Test Product',
      description: 'Test description',
    };

    return request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newProduct.title);
        expect(res.body.description).toBe(newProduct.description);
      });
  });
});
