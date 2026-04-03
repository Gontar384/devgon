import React from 'react';
import {
  FallbackContent,
  ContentOrFallback,
} from '@/cms/content/content-types';
import { ServicePageManagerProps } from '@/app/services/service-page-types';
import { ServiceHero } from '@/app/services/ui/hero/ServiceHero';
import { ServiceBreakdown } from '@/app/services/ui/breakdown/ServiceBreakdown';
import { ServiceWhy } from '@/app/services/ui/why/ServiceWhy';
import { HomeContact } from '@/app/home/ui/home-contact/HomeContact';

import systemsHeroFallbackJson from '@/app/services/fallbacks/systems-hero-fallback.json';
import systemsBreakdownFallbackJson from '@/app/services/fallbacks/systems-breakdown-fallback.json';
import systemsWhyFallbackJson from '@/app/services/fallbacks/systems-why-fallback.json';

import integrationsHeroFallbackJson from '@/app/services/fallbacks/integrations-hero-fallback.json';
import integrationsBreakdownFallbackJson from '@/app/services/fallbacks/integrations-breakdown-fallback.json';
import integrationsWhyFallbackJson from '@/app/services/fallbacks/integrations-why-fallback.json';

import aiHeroFallbackJson from '@/app/services/fallbacks/ai-hero-fallback.json';
import aiBreakdownFallbackJson from '@/app/services/fallbacks/ai-breakdown-fallback.json';
import aiWhyFallbackJson from '@/app/services/fallbacks/ai-why-fallback.json';

import homeContactFallbackJson from '@/app/home/fallbacks/home-contact-fallback.json';

const FALLBACKS = {
  systems: {
    hero: systemsHeroFallbackJson as FallbackContent,
    breakdown: systemsBreakdownFallbackJson as FallbackContent,
    why: systemsWhyFallbackJson as FallbackContent,
  },
  integrations: {
    hero: integrationsHeroFallbackJson as FallbackContent,
    breakdown: integrationsBreakdownFallbackJson as FallbackContent,
    why: integrationsWhyFallbackJson as FallbackContent,
  },
  ai: {
    hero: aiHeroFallbackJson as FallbackContent,
    breakdown: aiBreakdownFallbackJson as FallbackContent,
    why: aiWhyFallbackJson as FallbackContent,
  },
} as const;

export function ServiceManager({ contents, slug }: ServicePageManagerProps) {
  const fallbacks = FALLBACKS[slug];

  const heroCMS = contents[`${slug}-hero`]?.[0];
  const hero: ContentOrFallback = heroCMS ?? fallbacks.hero;

  const breakdownCMS = contents[`${slug}-breakdown`]?.[0];
  const breakdown: ContentOrFallback = breakdownCMS ?? fallbacks.breakdown;

  const whyCMS = contents[`${slug}-why`]?.[0];
  const why: ContentOrFallback = whyCMS ?? fallbacks.why;

  const contactCMS = contents['home-contact']?.[0];
  const contact: ContentOrFallback =
    contactCMS ?? (homeContactFallbackJson as FallbackContent);

  return (
    <>
      <ServiceHero content={hero} />
      <ServiceBreakdown content={breakdown} />
      <ServiceWhy content={why} />
      <HomeContact content={contact} />
    </>
  );
}
