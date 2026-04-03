import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminSystemsManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const systemsHero = contents['systems-hero'] ?? [];
  const systemsBreakdown = contents['systems-breakdown'] ?? [];
  const systemsWhy = contents['systems-why'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Aplikacje i systemy</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={systemsHero}
          contentKey={'systems-hero'}
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
          contents={systemsBreakdown}
          contentKey={'systems-breakdown'}
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
          contents={systemsWhy}
          contentKey={'systems-why'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 300,
            description: 0,
            customData: 2000,
          }}
          maxMedia={0}
        />
      </div>
    </div>
  );
}
