import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/content/ui/atomic/AdminContentErrorBanner';

export function AdminAboutManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const aboutMainCard = contents['about-main-card'] ?? [];
  const aboutSideCards = contents['about-side-cards'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">O nas</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={aboutMainCard}
          contentKey={'about-main-card'}
          mode={'single'}
          fields={{ title: 100, header: 100, description: 500 }}
          maxMedia={5}
        />
        <ContentCardManager
          contents={aboutSideCards}
          contentKey={'about-side-cards'}
          mode={'multiple'}
          fields={{ title: 100, header: 100, description: 500 }}
          maxMedia={3}
        />
      </div>
    </div>
  );
}
