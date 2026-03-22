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
import homeTechFallbackJson from '@/app/home/fallbacks/home-tech-fallback.json';
import homeProcessFallbackJson from '@/app/home/fallbacks/home-process-fallback.json';
import { HomeServicesCarousel } from '@/app/home/ui/HomeServicesCarousel';
import { TiltCard } from '@/app/home/ui/parts/animations/TiltCard';
import { HomeProblemsSection } from '@/app/home/ui/HomeProblemsSection';
import { HomeIntro } from '@/app/home/ui/HomeIntro';
import { HomeTech } from '@/app/home/ui/HomeTech';
import { HomeProcess } from '@/app/home/ui/HomeProcess';

const homeHeroFallback = homeHeroFallbackJson as FallbackContent;
const homeIntroFallback = homeIntroFallbackJson as FallbackContent;
const homeServicesFallback = homeServicesFallbackJson as FallbackContent[];
const homeProblemsFallback = homeProblemsFallbackJson as FallbackContent;
const homeProcessFallback = homeProcessFallbackJson as FallbackContent;
const homeTechFallback = homeTechFallbackJson as FallbackContent;

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

  const homeProcessCMS = contents['home-process']?.[0];
  const homeProcess: ContentOrFallback = homeProcessCMS
    ? homeProcessCMS
    : homeProcessFallback;

  const homeTechCMS = contents['home-tech']?.[0];
  const homeTech: ContentOrFallback = homeTechCMS
    ? homeTechCMS
    : homeTechFallback;

  return (
    <>
      <HomeHero content={homeHero} />
      <HomeIntro content={homeIntro} />
      <HomeServicesCarousel count={homeServices.length}>
        {homeServices.map((content, i) => (
          <TiltCard key={'id' in content ? content.id : `fallback-ahs${i}`}>
            <HomeServiceCard content={content} priority={i === 0} />
          </TiltCard>
        ))}
      </HomeServicesCarousel>
      <HomeProblemsSection content={homeProblems} />
      <HomeProcess content={homeProcess} />
      <HomeTech content={homeTech} />
    </>
  );
}
