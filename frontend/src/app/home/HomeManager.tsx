import { HomeServiceCard } from '@/app/home/ui/HomeServiceCard';
import React from 'react';
import { HomeManagerProps } from '@/app/home/home-types';
import { HomeHero } from '@/app/home/ui/HomeHero';
import {
  ContentOrFallback,
  FallbackContent,
} from '@/cms/content/content-types';
import homeHeroFallbackJson from '@/app/home/fallbacks/home-hero-fallback.json';
import homeServicesFallbackJson from '@/app/home/fallbacks/home-services-fallback.json';
import { HomeServicesCarousel } from '@/app/home/ui/HomeServicesCarousel';
import { TiltCard } from '@/app/home/ui/parts/animations/TiltCard';

const homeServicesFallback = homeServicesFallbackJson as FallbackContent[];
const homeHeroFallback = homeHeroFallbackJson as FallbackContent;

export function HomeManager({ contents }: HomeManagerProps) {
  const homeHeroCMS = contents['home-hero']?.[0];
  const homeHero: ContentOrFallback = homeHeroCMS
    ? homeHeroCMS
    : homeHeroFallback;

  const homeServicesCMS = contents['home-services'] ?? [];
  const homeServices: ContentOrFallback[] = [
    ...homeServicesCMS,
    ...homeServicesFallback.slice(homeServicesCMS.length),
  ];

  return (
    <>
      <HomeHero content={homeHero} />
      <section className="w-full py-12">
        <div className="max-w-[1700px] mx-auto">
          <HomeServicesCarousel count={homeServices.length}>
            {homeServices.map((content, i) => (
              <TiltCard key={'id' in content ? content.id : `fallback-${i}`}>
                <HomeServiceCard content={content} priority={i === 0} />
              </TiltCard>
            ))}
          </HomeServicesCarousel>
        </div>
      </section>
    </>
  );
}
