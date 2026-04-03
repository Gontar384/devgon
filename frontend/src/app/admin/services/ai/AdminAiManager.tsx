import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminAiManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const aiHero = contents['ai-hero'] ?? [];
  const aiBreakdown = contents['ai-breakdown'] ?? [];
  const aiWhy = contents['ai-why'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Analityka i wdrażanie AI</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={aiHero}
          contentKey={'ai-hero'}
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
          contents={aiBreakdown}
          contentKey={'ai-breakdown'}
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
          contents={aiWhy}
          contentKey={'ai-why'}
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
