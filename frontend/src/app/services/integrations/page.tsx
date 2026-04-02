import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { ServiceManager } from '@/app/services/ServiceManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Automations & Integrations — devgon',
    description:
      'Łączymy Twoje systemy w jeden organizm. Automatyzujemy powtarzalne procesy, integrujemy CRM, ERP i e-commerce. 80% mniej ręcznej pracy.',
    path: '/services/integrations',
  });

export default async function IntegrationsPage() {
  const { contents } = await loadPageContents([
    'service-hero',
    'service-breakdown',
    'service-why',
    'home-contact',
  ]);

  return <ServiceManager contents={contents} slug="integrations" />;
}
