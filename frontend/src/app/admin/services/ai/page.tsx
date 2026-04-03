import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { AdminAiManager } from '@/app/admin/services/ai/AdminAiManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'AI & Data Engineering — devgon',
    description:
      'Wdrażamy asystentów AI, analitykę predykcyjną i automatyzację kognitywną. Twoje dane stają się decyzjami. ROI policzalny przed wdrożeniem.',
    path: '/services/ai',
  });

export const dynamic = 'force-dynamic';

export default async function AdminAiPage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'ai-hero',
    'ai-breakdown',
    'ai-why',
  ]);

  return (
    <AdminLayout>
      <AdminAiManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
