import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { ServiceManager } from '@/app/services/ServiceManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'AI & Data Engineering — devgon',
    description:
      'Wdrażamy asystentów AI, analitykę predykcyjną i automatyzację kognitywną. Twoje dane stają się decyzjami. ROI policzalny przed wdrożeniem.',
    path: '/services/ai',
  });

export default async function AiPage() {
  const { contents } = await loadPageContents([
    'ai-hero',
    'ai-breakdown',
    'ai-why',
    'home-contact',
  ]);

  return <ServiceManager contents={contents} slug="ai" />;
}
