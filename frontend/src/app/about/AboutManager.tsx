'use client';

import React from 'react';
import { AboutCard } from '@/app/about/ui/AboutCard';
import { AboutManagerProps } from '@/app/about/about-types';

export function AboutManager({ contents }: AboutManagerProps) {
  const aboutMainCard = contents['about-main-card']?.[0];
  const aboutSideCards = contents['about-side-cards'] ?? [];

  return (
    <section className="w-full min-h-screen relative">
      <div className="flex flex-col items-center px-2">
        <h1 className="text-4xl font-extrabold text-center pt-10 pb-4">
          O nas
        </h1>
        <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
          <AboutCard content={aboutMainCard} />
          {aboutSideCards.map((cardContent) => (
            <AboutCard key={cardContent.id} content={cardContent} />
          ))}
        </div>
      </div>
    </section>
  );
}
