import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { CmsManager } from '@/app/cms/CmsManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon — the code-first CMS behind this site',
    description:
      'A custom headless CMS built with Next.js, NestJS, GraphQL, PostgreSQL and MinIO. Build the UI freely, then expose any section to admin editing - no schema migrations.',
    path: '/cms',
  });

export default async function CmsPage() {
  const { contents } = await loadPageContents([
    'cms-hero',
    'cms-flow',
    'cms-breakdown',
    'cms-preview',
    'cms-why',
    'home-contact',
  ]);

  return <CmsManager contents={contents} />;
}
