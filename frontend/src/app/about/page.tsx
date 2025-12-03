import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { AboutManager } from '@/app/about/ui/AboutManager';
import { getContent } from '@/lib/graphql/graphqlUtil';
import { Content } from '@/lib/graphql/types';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - O nas',
    description:
      'Poznaj naszą działalność: o devgon, naszych projektach, zespole. Wszystko co musisz wiedzieć, aby podjąć z nami współpracę!',
    path: '/about',
  });

export default async function AboutPage() {
  const content: Content | null = await getContent('about-main-card');

  return (
    <AboutManager title={content?.title} description={content?.description} />
  );
}
