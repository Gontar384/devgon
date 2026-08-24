import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon — admin panel',
    description: 'Admin panel - manage the content of this site',
    path: '/admin',
  });

export default async function AdminPage() {
  redirect('/admin/home');
}
