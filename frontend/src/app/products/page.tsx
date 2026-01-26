import { createMetadata } from '@/lib/metadata/metadata';
import api from '@/lib/auth/axios';
import { ProductsManager } from '@/app/products/ProductsManager';
import { Metadata } from 'next';
import fallbackProducts from '@/app/products/products-fallback.json';
import { verifyAuth } from '@/lib/auth/verifyAuth';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Produkty',
    description: 'Lista produktów i możliwość dodawania nowych',
    path: '/products',
  });

async function getProducts() {
  try {
    const res = await api.get('/api/products');
    return res.data;
  } catch (err) {
    console.error(err);
    return fallbackProducts;
  }
}

export default async function ProductsPage() {
  await verifyAuth('/products');
  const products = await getProducts();
  return <ProductsManager initialProducts={products} />;
}
