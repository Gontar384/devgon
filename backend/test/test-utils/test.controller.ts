import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

@Controller('test-utils')
export class TestController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('reset-db')
  async resetDatabase() {
    await this.prisma.$transaction([this.prisma.product.deleteMany()]);
    return { message: 'Database reset' };
  }
}
