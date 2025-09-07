import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import pageData from '@/app/page-ui/pageData.json';
import { HomeManager } from '@/app/page-ui/HomeManager';
import { checkAuth } from '@/lib/checkAuth';

export const generateMetadata = (): Metadata =>
  createMetadata(pageData.metaData);

async function getContent() {
  try {
  } catch (err) {
    console.error(err);
    return;
  }
}

export default async function HomePage() {
  await checkAuth('/');

  await getContent();
  return <HomeManager />;
}
