import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import pageData from '@/app/page-ui/pageData.json';
import fallbackProducts from '@/app/products/products-fallback.json';
import { HomeManager } from '@/app/page-ui/HomeManager';

export const generateMetadata = (): Metadata =>
  createMetadata(pageData.metaData);

async function getContent() {
  try {
    console.log('test');
  } catch (err) {
    console.error(err);
    return fallbackProducts;
  }
}

export default async function HomePage() {
  await getContent();
  return <HomeManager />;
}
