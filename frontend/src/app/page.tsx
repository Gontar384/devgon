import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import homeData from '@/app/home/util/homeData.json';
import { HomeManager } from '@/app/home/util/HomeManager';

export const generateMetadata = (): Metadata =>
  createMetadata(homeData.metaData);

async function getContent() {
  try {
  } catch (err) {
    console.error(err);
    return;
  }
}

export default async function HomePage() {
  await getContent();
  return <HomeManager />;
}
