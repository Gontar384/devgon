import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { ServiceManager } from '@/app/services/ServiceManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Software & Web Development — devgon',
    description:
      'Budujemy dedykowane systemy cyfrowe: sklepy internetowe, aplikacje webowe, platformy SaaS i backendowe API. Szybko, stabilnie i gotowe na skale.',
    path: '/services/systems',
  });

export default async function SystemsPage() {
  const { contents } = await loadPageContents([
    'systems-hero',
    'systems-breakdown',
    'systems-why',
    'home-contact',
  ]);

  return <ServiceManager contents={contents} slug="systems" />;
}
