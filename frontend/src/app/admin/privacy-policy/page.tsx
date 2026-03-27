import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { AdminPrivacyPolicyManager } from '@/app/admin/privacy-policy/AdminPrivacyPolicyManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon – Nowoczesne aplikacje i automatyzacja dla firm',
    description:
      'Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.',
    path: '/',
  });

export const dynamic = 'force-dynamic';

export default async function AdminPrivacyPolicyPage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'privacy-policy-info',
    'privacy-policy-sections',
  ]);

  return (
    <AdminLayout>
      <AdminPrivacyPolicyManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
