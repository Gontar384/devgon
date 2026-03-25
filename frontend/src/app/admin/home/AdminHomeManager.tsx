import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminHomeManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const homeHero = contents['home-hero'] ?? [];
  const homeIntro = contents['home-intro'] ?? [];
  const homeServices = contents['home-services'] ?? [];
  const homeProblems = contents['home-problems'] ?? [];
  const homeProcess = contents['home-process'] ?? [];
  const homeTech = contents['home-tech'] ?? [];
  const homeAbout = contents['home-about'] ?? [];
  const homeContact = contents['home-contact'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Strona główna</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={homeHero}
          contentKey={'home-hero'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 200,
            description: 500,
            customData: 1000,
          }}
          maxMedia={0}
        />
        <ContentCardManager
          contents={homeIntro}
          contentKey={'home-intro'}
          mode={'single'}
          fields={{
            title: 40,
            subtitle: 100,
            description: 0,
            customData: 0,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={homeServices}
          contentKey={'home-services'}
          mode={'multiple'}
          fields={{
            title: 100,
            subtitle: 100,
            description: 500,
            customData: 500,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={homeProblems}
          contentKey={'home-problems'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 100,
            description: 0,
            customData: 1000,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={homeProcess}
          contentKey={'home-process'}
          mode={'single'}
          fields={{
            title: 50,
            subtitle: 100,
            description: 0,
            customData: 1000,
          }}
          maxMedia={0}
        />
        <ContentCardManager
          contents={homeTech}
          contentKey={'home-tech'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 100,
            description: 0,
            customData: 0,
          }}
          maxMedia={20}
        />
        <ContentCardManager
          contents={homeAbout}
          contentKey={'home-about'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 100,
            description: 500,
            customData: 0,
          }}
          maxMedia={1}
        />
        <ContentCardManager
          contents={homeContact}
          contentKey={'home-contact'}
          mode={'single'}
          fields={{
            title: 50,
            subtitle: 150,
            description: 0,
            customData: 0,
          }}
          maxMedia={0}
        />
      </div>
    </div>
  );
}
