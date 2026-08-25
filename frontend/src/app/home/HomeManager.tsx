import { HomeProjectCard } from '@/app/home/ui/home-projects/HomeProjectCard';
import React from 'react';
import { HomeManagerProps } from '@/app/home/home-types';
import { HomeHero } from '@/app/home/ui/home-hero/HomeHero';
import {
  ContentOrFallback,
  FallbackContent,
} from '@/cms/content/content-types';
import homeHeroFallbackJson from '@/app/home/fallbacks/home-hero-fallback.json';
import homeProjectsFallbackJson from '@/app/home/fallbacks/home-projects-fallback.json';
import homeExperienceFallbackJson from '@/app/home/fallbacks/home-experience-fallback.json';
import homeIntroFallbackJson from '@/app/home/fallbacks/home-intro-fallback.json';
import homeTechFallbackJson from '@/app/home/fallbacks/home-tech-fallback.json';
import homeWorkflowFallbackJson from '@/app/home/fallbacks/home-workflow-fallback.json';
import homeAboutFallbackJson from '@/app/home/fallbacks/home-about-fallback.json';
import homeContactFallbackJson from '@/app/home/fallbacks/home-contact-fallback.json';
import { HomeProjectsCarousel } from '@/app/home/ui/home-projects/HomeProjectsCarousel';
import { TiltCard } from '@/app/home/ui/home-projects/parts/TiltCard';
import { HomeExperience } from '@/app/home/ui/home-experience/HomeExperience';
import { HomeIntro } from '@/app/home/ui/home-intro/HomeIntro';
import { HomeTech } from '@/app/home/ui/home-tech/HomeTech';
import { HomeWorkflow } from '@/app/home/ui/home-workflow/HomeWorkflow';
import { HomeAbout } from '@/app/home/ui/home-about/HomeAbout';
import { HomeContact } from '@/app/home/ui/home-contact/HomeContact';

const homeHeroFallback = homeHeroFallbackJson as FallbackContent;
const homeIntroFallback = homeIntroFallbackJson as FallbackContent;
const homeProjectsFallback = homeProjectsFallbackJson as FallbackContent[];
const homeExperienceFallback = homeExperienceFallbackJson as FallbackContent;
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

  const homeProjectsCMS = contents['home-projects'] ?? [];
  const homeProjects: ContentOrFallback[] = [
    ...homeProjectsCMS,
    ...homeProjectsFallback.slice(homeProjectsCMS.length),
  ];

  const homeExperienceCMS = contents['home-experience']?.[0];
  const homeExperience: ContentOrFallback = homeExperienceCMS
    ? homeExperienceCMS
    : homeExperienceFallback;

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
      <HomeProjectsCarousel count={homeProjects.length}>
        {homeProjects.map((content, i) => (
          <TiltCard key={'id' in content ? content.id : `fallback-ahp${i}`}>
            <HomeProjectCard content={content} priority={i === 0} />
          </TiltCard>
        ))}
      </HomeProjectsCarousel>
      <HomeExperience content={homeExperience} />
      <HomeWorkflow content={homeWorkflow} />
      <HomeTech content={homeTech} />
      <HomeAbout content={homeAbout} />
      <HomeContact content={homeContact} />
    </>
  );
}
