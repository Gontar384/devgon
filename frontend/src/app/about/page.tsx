import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AboutManager } from '@/app/about/ui/AboutManager';
import { loadPageContents } from '@/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - O nas',
    description:
      'Poznaj naszą działalność: o devgon, naszych projektach, zespole. Wszystko co musisz wiedzieć, aby podjąć z nami współpracę!',
    path: '/about',
  });

export const revalidate = 3600;

export default async function AboutPage() {
  const { contents } = await loadPageContents([
    'about-main-card',
    'about-side-cards',
  ]);

  return <AboutManager contents={contents} />;
}
