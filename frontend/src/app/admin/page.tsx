import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Panel administratora',
    description: 'Panel administratora - zarządzanie contentem',
    path: '/admin',
  });

export default async function AdminPage() {
  redirect('/admin/home');
}
