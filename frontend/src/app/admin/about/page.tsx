import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { getPageContents } from '@/lib/graphql/contentService';
import { AdminAboutManager } from '@/app/admin/about/AdminAboutManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora | O nas',
    description: 'Panel administratora - zarządzanie contentem | O nas',
    path: '/admin/about',
  });

export default async function AdminAboutPage() {
  const authUser = await verifyAuth('/admin/about');
  const contents = await getPageContents([
    'about-main-card',
    'about-side-cards',
  ]);

  return (
    <AdminLayout>
      {authUser.role === 'admin' && <AdminAboutManager contents={contents} />}
    </AdminLayout>
  );
}
