import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminHomeManager } from '@/app/admin/home/AdminHomeManager';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon – Nowoczesne aplikacje i automatyzacja dla firm',
    description:
      'Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.',
    path: '/',
  });

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'home-hero',
    'home-intro',
    'home-services',
    'home-problems',
    'home-tech',
  ]);

  return (
    <AdminLayout>
      <AdminHomeManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
