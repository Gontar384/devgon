import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { getContent } from '@/lib/graphql/contentService';
import { AdminAboutManager } from '@/app/admin/about/AdminAboutManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora | O nas',
    description: 'Panel administratora - zarządzanie contentem | O nas',
    path: '/admin/about',
  });

export default async function AdminAboutPage() {
  const authUser = await verifyAuth('/admin/about');

  const mainCardContent = await getContent('about-main-card');

  return (
    <AdminLayout>
      <AdminAboutManager
        mainCardContent={mainCardContent}
        authUser={authUser}
      />
    </AdminLayout>
  );
}
