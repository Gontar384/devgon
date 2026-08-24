import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminCmsManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const cmsHero = contents['cms-hero'] ?? [];
  const cmsFlow = contents['cms-flow'] ?? [];
  const cmsBreakdown = contents['cms-breakdown'] ?? [];
  const cmsPreview = contents['cms-preview'] ?? [];
  const cmsWhy = contents['cms-why'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">CMS page</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={cmsHero}
          contentKey={'cms-hero'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 0,
            description: 500,
            customData: 1000,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={cmsFlow}
          contentKey={'cms-flow'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 300,
            description: 0,
            customData: 1500,
          }}
          maxMedia={0}
        />
        <ContentCardManager
          contents={cmsBreakdown}
          contentKey={'cms-breakdown'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 300,
            description: 0,
            customData: 3000,
          }}
          maxMedia={0}
        />
        <ContentCardManager
          contents={cmsPreview}
          contentKey={'cms-preview'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 300,
            description: 0,
            customData: 0,
          }}
          maxMedia={5}
        />
        <ContentCardManager
          contents={cmsWhy}
          contentKey={'cms-why'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 300,
            description: 0,
            customData: 2500,
          }}
          maxMedia={0}
        />
      </div>
    </div>
  );
}
