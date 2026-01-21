import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCard } from '@/app/admin/content-util/ContentCard';
import { ContentCardList } from '@/app/admin/content-util/ContentCardList';

export function AdminAboutManager({ contents }: AdminManagerProps) {
  const aboutMainCard = contents['about-main-card']?.[0];
  const aboutSideCards = contents['about-side-cards'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      <h1 className="sr-only">O nas</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCard
          content={aboutMainCard}
          contentKey="about-main-card"
          isTitle={true}
          isHeader={true}
          isDescription={true}
        />
        <ContentCardList
          contents={aboutSideCards}
          contentKey="about-side-cards"
          isTitle={true}
          isHeader={true}
          isDescription={true}
        />
      </div>
    </div>
  );
}
