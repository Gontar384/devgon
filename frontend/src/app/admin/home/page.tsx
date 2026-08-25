import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminHomeManager } from '@/app/admin/home/AdminHomeManager';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Jakub Gontarek — Fullstack Engineer',
    description:
      'Fullstack Engineer with 3 years of experience taking projects from requirements to production. React, Next.js, NestJS, Java, Spring Boot, PostgreSQL, Docker and CI/CD.',
    path: '/',
  });

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'home-hero',
    'home-intro',
    'home-projects',
    'home-experience',
    'home-workflow',
    'home-tech',
    'home-about',
    'home-contact',
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
