import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { getContent } from '@/lib/graphql/graphqlUtil';
import { AdminManager } from '@/app/admin/ui/AdminManager';
import { Content } from '@/lib/graphql/graphql-types';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora',
    description: 'Panel administratora, pozawalający zarządzać contentem.',
    path: '/admin',
  });

export default async function AdminPage() {
  const authUser = await verifyAuth('/admin');

  const mainCardContent: Content | null = await getContent('about-main-card');

  return <AdminManager mainCardContent={mainCardContent} authUser={authUser} />;
}
