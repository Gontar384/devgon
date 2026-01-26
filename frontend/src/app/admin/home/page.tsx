import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminHomeManager } from '@/app/admin/home/AdminHomeManager';
import { loadPageContents } from '@/lib/graphql/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora | Strona główna',
    description: 'Panel administratora - zarządzanie contentem | Strona główna',
    path: '/admin/home',
  });

export const revalidate = 3600;

export default async function AdminHomePage() {
  await verifyAuth('/admin/home');

  const { contents, error, failedKeys } = await loadPageContents([
    'about-main-card',
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
