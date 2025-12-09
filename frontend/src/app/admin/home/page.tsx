import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { getContent } from '@/lib/graphql/contentService';
import { AdminHomeManager } from '@/app/admin/home/AdminHomeManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora | Strona główna',
    description: 'Panel administratora - zarządzanie contentem | Strona główna',
    path: '/admin/home',
  });

export default async function AdminHomePage() {
  const authUser = await verifyAuth('/admin/home');

  const mainCardContent = await getContent('about-main-card');

  return (
    <AdminLayout>
      <AdminHomeManager mainCardContent={mainCardContent} authUser={authUser} />
    </AdminLayout>
  );
}
