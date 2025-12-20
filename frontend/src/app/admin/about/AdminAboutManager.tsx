'use client';
import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCard } from '@/app/admin/content/ContentCard';

export function AdminAboutManager({ contents }: AdminManagerProps) {
  const aboutMainCard = contents['about-main-card']?.[0];

  return (
    <div className="flex flex-col items-center px-2">
      <h1 className="sr-only">O nas</h1>
      <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
        <ContentCard content={aboutMainCard} />
      </div>
    </div>
  );
}
