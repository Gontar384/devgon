import { ServiceCard } from '@/app/home/ui/ServiceCard';
import React from 'react';
import { HomeManagerProps } from '@/app/home/home-types';
import { Hero } from '@/app/home/ui/Hero';
import {
  ContentOrFallback,
  FallbackContent,
} from '@/cms/content/content-types';
import homeHeroFallbackJson from '@/app/home/fallbacks/home-hero-fallback.json';
import homeServicesFallbackJson from '@/app/home/fallbacks/home-services-fallback.json';
import { AnimateIn } from '@/app/home/ui/parts/AnimateIn';

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
      <AnimateIn>
        <Hero content={homeHero} />
      </AnimateIn>
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeServices.map((content, i) => (
              <AnimateIn
                key={'id' in content ? content.id : `fallback-${i}`}
                delay={i * 150}
              >
                <ServiceCard content={content} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
