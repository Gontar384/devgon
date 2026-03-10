import { MainCard } from '@/app/home/ui/MainCard';
import { SideCard } from '@/app/home/ui/SideCard';
import React from 'react';
import { HomeManagerProps } from '@/app/home/home-types';
import { Hero } from '@/app/home/ui/Hero';

export function HomeManager({ contents }: HomeManagerProps) {
  const homeHeroCard = contents['home-hero-card']?.[0];
  const homeServiceCards = contents['home-service-cards'] ?? [];

  return (
    <section className="w-full min-h-screen relative">
      <div className="relative flex flex-col items-center px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mt-14">
          <div className="md:col-span-3">
            <Hero content={homeHeroCard} />
            <MainCard content={homeHeroCard} />
          </div>
          {homeServiceCards.map((content) => (
            <SideCard key={content.id} content={content} />
          ))}
        </div>
      </div>
    </section>
  );
}
