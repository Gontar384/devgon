import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cleanDb = async () => {
  await prisma.product.deleteMany();
};

export const disconnectDb = async () => {
  await prisma.$disconnect();
};
