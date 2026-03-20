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
import homeProblemsFallbackJson from '@/app/home/fallbacks/home-problems-fallback.json';
import homeIntroFallbackJson from '@/app/home/fallbacks/home-intro-fallback.json';
import { HomeServicesCarousel } from '@/app/home/ui/HomeServicesCarousel';
import { TiltCard } from '@/app/home/ui/parts/animations/TiltCard';
import { HomeProblemsSection } from '@/app/home/ui/HomeProblemsSection';
import { AnimateComponent } from '@/app/home/ui/parts/animations/AnimateComponent';
import { HomeIntro } from '@/app/home/ui/HomeIntro';

const homeHeroFallback = homeHeroFallbackJson as FallbackContent;
const homeIntroFallback = homeIntroFallbackJson as FallbackContent;
const homeServicesFallback = homeServicesFallbackJson as FallbackContent[];
const homeProblemsFallback = homeProblemsFallbackJson as FallbackContent;

export function HomeManager({ contents }: HomeManagerProps) {
  const homeHeroCMS = contents['home-hero']?.[0];
  const homeHero: ContentOrFallback = homeHeroCMS
    ? homeHeroCMS
    : homeHeroFallback;

  const homeIntroCMS = contents['home-intro']?.[0];
  const homeIntro: ContentOrFallback = homeIntroCMS
    ? homeIntroCMS
    : homeIntroFallback;

  const homeServicesCMS = contents['home-services'] ?? [];
  const homeServices: ContentOrFallback[] = [
    ...homeServicesCMS,
    ...homeServicesFallback.slice(homeServicesCMS.length),
  ];

  const homeProblemsCMS = contents['home-problems']?.[0];
  const homeProblems: ContentOrFallback = homeProblemsCMS
    ? homeProblemsCMS
    : homeProblemsFallback;

  return (
    <>
      <HomeHero content={homeHero} />
      <HomeIntro content={homeIntro} />
      <section className="w-full py-12">
        <div className="max-w-[1700px] mx-auto">
          <HomeServicesCarousel count={homeServices.length}>
            {homeServices.map((content, i) => (
              <AnimateComponent
                key={'id' in content ? content.id : `fallback-ahs${i}`}
                delay={0.15 * i}
              >
                <div className="will-change-transform">
                  <TiltCard>
                    <HomeServiceCard content={content} priority={i === 0} />
                  </TiltCard>
                </div>
              </AnimateComponent>
            ))}
          </HomeServicesCarousel>
        </div>
      </section>
      <HomeProblemsSection content={homeProblems} />
    </>
  );
}
