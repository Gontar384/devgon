import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { AdminCmsManager } from '@/app/admin/cms/AdminCmsManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon — the code-first CMS behind this site',
    description:
      'A custom headless CMS built with Next.js, NestJS, GraphQL, PostgreSQL and MinIO. Build the UI freely, then expose any section to admin editing - no schema migrations.',
    path: '/cms',
  });

export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  const { contents, error, failedKeys } = await loadPageContents([
    'cms-hero',
    'cms-flow',
    'cms-breakdown',
    'cms-preview',
    'cms-why',
  ]);

  return (
    <AdminLayout>
      <AdminCmsManager
        contents={contents}
        error={error}
        failedKeys={failedKeys}
      />
    </AdminLayout>
  );
}
