import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    it('should call productRepository.create with correct params and return result', async () => {
      const productData = { title: 'Test title', description: 'Test desc' };
      const createdProduct = { id: 1, ...productData };

      (repository.create as jest.Mock).mockResolvedValue(createdProduct);

      const result = await service.create(
        productData.title,
        productData.description,
      );

      expect(repository.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(createdProduct);
    });

    it('should call productRepository.create with title only when description is omitted', async () => {
      const productData = { title: 'Only title' };
      const createdProduct = { id: 2, title: 'Only title' };

      (repository.create as jest.Mock).mockResolvedValue(createdProduct);

      const result = await service.create(productData.title);

      expect(repository.create).toHaveBeenCalledWith({
        title: productData.title,
        description: undefined,
      });
      expect(result).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [
        { id: 1, title: 'Product 1' },
        { id: 2, title: 'Product 2' },
      ];

      (repository.findAll as jest.Mock).mockResolvedValue(products);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });
});
