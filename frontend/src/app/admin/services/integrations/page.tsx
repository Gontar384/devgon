import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { AdminIntegrationsManager } from '@/app/admin/services/integrations/AdminIntegrationsManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Automations & Integrations — devgon',
    description:
      'Łączymy Twoje systemy w jeden organizm. Automatyzujemy powtarzalne procesy, integrujemy CRM, ERP i e-commerce. 80% mniej ręcznej pracy.',
    path: '/services/integrations',
  });

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'integrations-hero',
    'integrations-breakdown',
    'integrations-why',
  ]);

  return (
    <AdminLayout>
      <AdminIntegrationsManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
