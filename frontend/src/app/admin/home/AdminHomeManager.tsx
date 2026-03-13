import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminHomeManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const homeHeroCard = contents['home-hero-card'] ?? [];
  const homeServiceCards = contents['home-service-cards'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Strona główna</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={homeHeroCard}
          contentKey={'home-hero-card'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 200,
            description: 500,
            customData: 500,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={homeServiceCards}
          contentKey={'home-service-cards'}
          mode={'multiple'}
          fields={{
            title: 100,
            subtitle: 100,
            description: 500,
            customData: 500,
          }}
          maxMedia={0}
        />
      </div>
    </div>
  );
}
