import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminAboutManager } from '@/app/admin/about/AdminAboutManager';
import { loadPageContents } from '@/lib/graphql/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora | O nas',
    description: 'Panel administratora - zarządzanie contentem | O nas',
    path: '/admin/about',
  });

export const revalidate = 3600;

export default async function AdminAboutPage() {
  await verifyAuth('/admin/about');

  const { contents, error, failedKeys } = await loadPageContents([
    'about-main-card',
    'about-side-cards',
  ]);

  return (
    <AdminLayout>
      <AdminAboutManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
