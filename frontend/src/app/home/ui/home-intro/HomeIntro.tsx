import React from 'react';
import { MediaType } from '@/cms/content/content-types';
import { HomeIntroProps } from '@/app/home/home-types';
import { HomeIntroImage } from './parts/HomeIntroImage';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { CursorGlow } from '@/app/home/ui/home-intro/parts/CursorGlow';
import { Berkshire_Swash } from 'next/font/google';

const berkshireSwash = Berkshire_Swash({
  subsets: ['latin'],
  weight: ['400'],
});

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
    <section
      id="intro"
      aria-label={safeData.title || 'Intro'}
      className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center"
    >
      {safeData.photoUrl && (
        <HomeIntroImage
          photoUrl={safeData.photoUrl}
          photoAlt={safeData.photoAlt}
          mediaType={safeData.mediaType}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <AnimateItem>
        <div className="relative z-10 text-center px-6 max-w-[1200px] select-none text-primary">
          {safeData.title && (
            <h2
              className={`text-6xl md:text-8xl ${berkshireSwash.className}`}
              dangerouslySetInnerHTML={{ __html: safeData.title }}
            />
          )}
          {safeData.subtitle && (
            <div
              className="text-xl md:text-2xl text-background mt-4"
              dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
            />
          )}
        </div>
      </AnimateItem>
      <CursorGlow cursorColor="muted" />
    </section>
  );
}
