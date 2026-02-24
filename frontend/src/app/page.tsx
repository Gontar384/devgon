import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { HomeManager } from '@/app/home/HomeManager';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Strona główna',
    description:
      'Poznaj naszą ofertę: inteligentne strony internetowe, nowoczesne rozwiązania technologiczne i automatyzacja procesów – wszystko dla twojej firmy.',
    path: '/',
  });

export const revalidate = 60;

export default async function HomePage() {
  const { contents } = await loadPageContents([
    'home-hero-card',
    'home-service-cards',
  ]);
  return <HomeManager contents={contents} />;
}
