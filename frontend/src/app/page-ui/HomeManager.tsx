import { ParticlesBackground } from '@/app/page-ui/parts/ParticlesBackground';
import { MainCard } from '@/app/page-ui/main-card/MainCard';
import { SideCard } from '@/app/page-ui/side-card/SideCard';
import React from 'react';
import { MainCardProps, SideCardProps } from '@/app/page-ui/types';
import pageData from '@/app/page-ui/pageData.json';

export function HomeManager() {
  const typedMainCardData: MainCardProps = pageData.mainCard;
  const typedSideCardData: SideCardProps[] = pageData.sideCard.items;

  return (
    <section className="w-full min-h-screen relative select-none">
      <ParticlesBackground />
      <div className="relative flex flex-col items-center px-4 z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mt-14">
          <div className="md:col-span-3">
            <MainCard
              mainHero={typedMainCardData.mainHero}
              description={typedMainCardData.description}
              content={typedMainCardData.content}
              imageSrc={typedMainCardData.imageSrc}
              imageAlt={typedMainCardData.imageAlt}
              imageW={typedMainCardData.imageW}
              imageH={typedMainCardData.imageH}
            />
          </div>
          {typedSideCardData.map((card) => (
            <SideCard
              key={card.sideHero.text}
              sideHero={card.sideHero}
              description={card.description}
              content={card.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
