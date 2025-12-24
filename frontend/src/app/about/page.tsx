import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { AboutManager } from '@/app/about/ui/AboutManager';
import { getPageContents } from '@/lib/graphql/contentService';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - O nas',
    description:
      'Poznaj naszą działalność: o devgon, naszych projektach, zespole. Wszystko co musisz wiedzieć, aby podjąć z nami współpracę!',
    path: '/about',
  });

export default async function AboutPage() {
  const contents = await getPageContents([
    'about-main-card',
    'about-side-cards',
  ]);

  return <AboutManager contents={contents} />;
}
