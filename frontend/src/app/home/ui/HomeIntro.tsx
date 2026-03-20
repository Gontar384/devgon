import React from 'react';
import { MediaType } from '@/cms/content/content-types';
import { HomeIntroProps } from '@/app/home/home-types';
import { HomeIntroImage } from './HomeIntroImage';
import { AnimateItem } from '@/app/home/ui/parts/animations/AnimateItem';
import { CursorGlow } from '@/app/home/ui/parts/animations/CursorGlow';

export function HomeIntro({ content }: HomeIntroProps) {
  if (!content) return null;

  const safeData = {
    title: content?.title ?? '',
    subtitle: content?.subtitle ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
  };

  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
      <HomeIntroImage
        photoUrl={safeData.photoUrl}
        photoAlt={safeData.photoAlt}
        mediaType={safeData.mediaType}
      />
      <div className="absolute inset-0 bg-black/50" />
      <AnimateItem delay={0.2}>
        <div className="relative z-10 text-center px-6 max-w-[1200px] select-none text-primary">
          <h2
            className="text-5xl md:text-7xl "
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
          <div
            className="text-lg md:text-xl text-background mt-4"
            dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
          />
        </div>
      </AnimateItem>
      <CursorGlow />
    </section>
  );
}
