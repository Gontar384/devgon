import { createMetadata } from '@/lib/metadata';
import api from '@/lib/axios';
import { ProductsManager } from '@/app/products/ProductsManager';
import { Metadata } from 'next';
import fallbackProducts from '@/data/products-fallback.json';

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
  const products = await getProducts();
  return <ProductsManager initialProducts={products} />;
}
