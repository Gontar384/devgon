import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/app/admin/content-util/ContentCardManager';
import { AdminContentErrorBanner } from '@/app/admin/content-util/atomic/AdminContentErrorBanner';

export function AdminHomeManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const aboutMainCard = contents['about-main-card'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Strona główna</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={aboutMainCard}
          contentKey={'about-main-card'}
          mode={'single'}
          fields={{ title: 100, header: 100, description: 500 }}
        />
      </div>
    </div>
  );
}
