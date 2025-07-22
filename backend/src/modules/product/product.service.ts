import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Product} from "./schemas/product.schema";
import {Model} from "mongoose";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) {}

    async create(title: string, description: string): Promise<Product> {
        const product = new this.productModel({ title, description });
        return product.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }
}