import { createMetadata } from '@/lib/metaData/metadata';
import { Metadata } from 'next';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { redirect } from 'next/navigation';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora',
    description: 'Panel administratora - zarządzanie contentem',
    path: '/admin',
  });

export default async function AdminPage() {
  await verifyAuth('/admin');

  redirect('/admin/home');
}
