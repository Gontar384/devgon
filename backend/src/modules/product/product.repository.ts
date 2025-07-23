import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: { title: string; description?: string }) {
        return this.prisma.product.create({ data });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }
}