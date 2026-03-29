import { HomeServiceCard } from '@/app/home/ui/home-services/HomeServiceCard';
import React from 'react';
import { HomeManagerProps } from '@/app/home/home-types';
import { HomeHero } from '@/app/home/ui/home-hero/HomeHero';
import {
  ContentOrFallback,
  FallbackContent,
} from '@/cms/content/content-types';
import homeHeroFallbackJson from '@/app/home/fallbacks/home-hero-fallback.json';
import homeServicesFallbackJson from '@/app/home/fallbacks/home-services-fallback.json';
import homeSolutionFallbackJson from '@/app/home/fallbacks/home-solution-fallback.json';
import homeIntroFallbackJson from '@/app/home/fallbacks/home-intro-fallback.json';
import homeTechFallbackJson from '@/app/home/fallbacks/home-tech-fallback.json';
import homeWorkflowFallbackJson from '@/app/home/fallbacks/home-workflow-fallback.json';
import homeAboutFallbackJson from '@/app/home/fallbacks/home-about-fallback.json';
import homeContactFallbackJson from '@/app/home/fallbacks/home-contact-fallback.json';
import { HomeServicesCarousel } from '@/app/home/ui/home-services/HomeServicesCarousel';
import { TiltCard } from '@/app/home/ui/home-services/parts/TiltCard';
import { HomeSolution } from '@/app/home/ui/home-solution/HomeSolution';
import { HomeIntro } from '@/app/home/ui/home-intro/HomeIntro';
import { HomeTech } from '@/app/home/ui/home-tech/HomeTech';
import { HomeWorkflow } from '@/app/home/ui/home-workflow/HomeWorkflow';
import { HomeAbout } from '@/app/home/ui/home-about/HomeAbout';
import { HomeContact } from '@/app/home/ui/home-contact/HomeContact';

const homeHeroFallback = homeHeroFallbackJson as FallbackContent;
const homeIntroFallback = homeIntroFallbackJson as FallbackContent;
const homeServicesFallback = homeServicesFallbackJson as FallbackContent[];
const homeSolutionFallback = homeSolutionFallbackJson as FallbackContent;
const homeWorkflowFallback = homeWorkflowFallbackJson as FallbackContent;
const homeTechFallback = homeTechFallbackJson as FallbackContent;
const homeAboutFallback = homeAboutFallbackJson as FallbackContent;
const homeContactFallback = homeContactFallbackJson as FallbackContent;

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

  const homeSolutionCMS = contents['home-solution']?.[0];
  const homeSolution: ContentOrFallback = homeSolutionCMS
    ? homeSolutionCMS
    : homeSolutionFallback;

  const homeWorkflowCMS = contents['home-workflow']?.[0];
  const homeWorkflow: ContentOrFallback = homeWorkflowCMS
    ? homeWorkflowCMS
    : homeWorkflowFallback;

  const homeTechCMS = contents['home-tech']?.[0];
  const homeTech: ContentOrFallback = homeTechCMS
    ? homeTechCMS
    : homeTechFallback;

  const homeAboutCMS = contents['home-about']?.[0];
  const homeAbout: ContentOrFallback = homeAboutCMS
    ? homeAboutCMS
    : homeAboutFallback;

  const homeContactCMS = contents['home-contact']?.[0];
  const homeContact: ContentOrFallback = homeContactCMS
    ? homeContactCMS
    : homeContactFallback;

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
      <HomeSolution content={homeSolution} />
      <HomeWorkflow content={homeWorkflow} />
      <HomeTech content={homeTech} />
      <HomeAbout content={homeAbout} />
      <HomeContact content={homeContact} />
    </>
  );
}
