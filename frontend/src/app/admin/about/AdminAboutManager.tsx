import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCard } from '@/app/admin/content/ContentCard';
import { ContentCardList } from '@/app/admin/content/ContentCardList';

export function AdminAboutManager({ contents }: AdminManagerProps) {
  const aboutMainCard = contents['about-main-card']?.[0];
  const aboutSideCards = contents['about-side-cards'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      <h1 className="sr-only">O nas</h1>
      <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-10 border">
        <ContentCard
          content={aboutMainCard}
          contentKey="about-main-card"
          isTitle={true}
          isHeader={true}
          isDescription={false}
        />
        <ContentCardList
          contents={aboutSideCards}
          contentKey="about-side-cards"
          isTitle={true}
          isHeader={true}
          isDescription={false}
        />
      </div>
    </div>
  );
}
