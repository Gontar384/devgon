import {Body, Controller, Get, Post} from '@nestjs/common';
import {ProductService} from "./product.service";
import {CreateProductDto} from "./dto/create-product.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(
            createProductDto.title,
            createProductDto.description,
        );
    }

    @Get()
    async findAll() {
        return this.productService.findAll();
    }
}