import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { AdminSystemsManager } from '@/app/admin/services/systems/AdminSystemsManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Software & Web Development — devgon',
    description:
      'Budujemy dedykowane systemy cyfrowe: sklepy internetowe, aplikacje webowe, platformy SaaS i backendowe API. Szybko, stabilnie i gotowe na skale.',
    path: '/services/systems',
  });

export const dynamic = 'force-dynamic';

export default async function AdminSystemsPage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'systems-hero',
    'systems-breakdown',
    'systems-why',
  ]);

  return (
    <AdminLayout>
      <AdminSystemsManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
