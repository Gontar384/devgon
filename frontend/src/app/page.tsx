import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import homeData from '@/app/home/util/homeData.json';
import { HomeManager } from '@/app/home/util/HomeManager';
import { verifyAuth } from '@/lib/auth/verifyAuth';

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
  await verifyAuth('/');
  await getContent();
  return <HomeManager />;
}
