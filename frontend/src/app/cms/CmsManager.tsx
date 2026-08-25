import React from 'react';
import {
  FallbackContent,
  ContentOrFallback,
} from '@/cms/content/content-types';
import { CmsManagerProps } from '@/app/cms/cms-page-types';
import { CmsHero } from '@/app/cms/ui/hero/CmsHero';
import { CmsBreakdown } from '@/app/cms/ui/breakdown/CmsBreakdown';
import { CmsPreview } from '@/app/cms/ui/preview/CmsPreview';
import { CmsWhy } from '@/app/cms/ui/why/CmsWhy';
import { HomeWorkflow } from '@/app/home/ui/home-workflow/HomeWorkflow';
import { HomeContact } from '@/app/home/ui/home-contact/HomeContact';

import cmsHeroFallbackJson from '@/app/cms/fallbacks/cms-hero-fallback.json';
import cmsFlowFallbackJson from '@/app/cms/fallbacks/cms-flow-fallback.json';
import cmsBreakdownFallbackJson from '@/app/cms/fallbacks/cms-breakdown-fallback.json';
import cmsPreviewFallbackJson from '@/app/cms/fallbacks/cms-preview-fallback.json';
import cmsWhyFallbackJson from '@/app/cms/fallbacks/cms-why-fallback.json';
import homeContactFallbackJson from '@/app/home/fallbacks/home-contact-fallback.json';

const cmsHeroFallback = cmsHeroFallbackJson as FallbackContent;
const cmsFlowFallback = cmsFlowFallbackJson as FallbackContent;
const cmsBreakdownFallback = cmsBreakdownFallbackJson as FallbackContent;
const cmsPreviewFallback = cmsPreviewFallbackJson as FallbackContent;
const cmsWhyFallback = cmsWhyFallbackJson as FallbackContent;
const homeContactFallback = homeContactFallbackJson as FallbackContent;

export function CmsManager({ contents }: CmsManagerProps) {
  const cmsHeroCMS = contents['cms-hero']?.[0];
  const cmsHero: ContentOrFallback = cmsHeroCMS ?? cmsHeroFallback;

  const cmsFlowCMS = contents['cms-flow']?.[0];
  const cmsFlow: ContentOrFallback = cmsFlowCMS ?? cmsFlowFallback;

  const cmsBreakdownCMS = contents['cms-breakdown']?.[0];
  const cmsBreakdown: ContentOrFallback =
    cmsBreakdownCMS ?? cmsBreakdownFallback;

  const cmsPreviewCMS = contents['cms-preview']?.[0];
  const cmsPreview: ContentOrFallback = cmsPreviewCMS ?? cmsPreviewFallback;

  const cmsWhyCMS = contents['cms-why']?.[0];
  const cmsWhy: ContentOrFallback = cmsWhyCMS ?? cmsWhyFallback;

  const contactCMS = contents['home-contact']?.[0];
  const contact: ContentOrFallback = contactCMS ?? homeContactFallback;

  return (
    <>
      <CmsHero content={cmsHero} />
      <HomeWorkflow content={cmsFlow} />
      <CmsBreakdown content={cmsBreakdown} />
      <CmsPreview content={cmsPreview} />
      <CmsWhy content={cmsWhy} />
      <HomeContact content={contact} />
    </>
  );
}
