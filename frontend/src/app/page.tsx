import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { HomeManager } from '@/app/home/HomeManager';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon – Nowoczesne aplikacje i automatyzacja dla firm',
    description:
      'Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.',
    path: '/',
  });

export default async function HomePage() {
  const { contents } = await loadPageContents(['home-hero', 'home-services']);
  return <HomeManager contents={contents} />;
}
