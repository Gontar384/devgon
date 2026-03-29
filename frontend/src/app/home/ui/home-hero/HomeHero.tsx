import React from 'react';
import { RotatingWords } from '@/app/home/ui/home-hero/parts/RotatingWords';
import { HomeHeroProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/home-hero/parts/TypingEffect';
import { ParticlesBackground } from '@/app/home/ui/home-hero/parts/ParticlesBackground';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { ScrollArrow } from '@/app/home/ui/home-hero/parts/ScrollArrow';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';

export function HomeHero({ content }: HomeHeroProps) {
  if (!content) return null;

  const safeData = {
    title: content?.title ?? '',
    subtitle: content?.subtitle ?? '',
    description: content?.description ?? '',
    typingWord: content?.customData?.typingWord ?? '',
    heroWords: content?.customData?.heroWords ?? '',
    primaryCta: content?.customData?.primaryCta ?? null,
    secondaryCta: content?.customData?.secondaryCta ?? null,
  };

  return (
    <section
      aria-label="Strona główna — sekcja powitalna"
      className="flex justify-center items-center w-full min-h-screen relative select-none"
    >
      <div className="backdrop-blur-[14px] absolute inset-0 z-20" />
      <ParticlesBackground id="hero-particles" />
      <div className="flex flex-col items-center justify-center px-6 py-12 gap-2 md:gap-3 text-center relative z-30 max-w-[800px]">
        {safeData.typingWord && (
          <AnimateItem delay={0}>
            <p aria-hidden="true" className="text-6xl md:text-7xl font-bold">
              <TypingEffect
                text={safeData.typingWord}
                speed={200}
                deleteSpeed={100}
                emptyWordPause={500}
                fullWordPause={3000}
                mode="typing"
              />
            </p>
            <span className="sr-only">{safeData.typingWord}</span>
          </AnimateItem>
        )}
        {safeData.title && (
          <AnimateItem delay={0.1}>
            <h1
              className="text-5xl md:text-6xl leading-tight"
              dangerouslySetInnerHTML={{ __html: safeData.title }}
            />
          </AnimateItem>
        )}
        {safeData.heroWords && (
          <AnimateItem delay={0.2}>
            <div
              className="text-3xl md:text-4xl text-primary"
              aria-live="polite"
              aria-atomic="true"
            >
              <RotatingWords words={safeData.heroWords} interval={2500} />
            </div>
          </AnimateItem>
        )}
        {safeData.subtitle && (
          <AnimateItem delay={0.3}>
            <div
              className="text-xl md:text-2xl"
              dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
            />
          </AnimateItem>
        )}
        {safeData.description && (
          <AnimateItem delay={0.4}>
            <div
              className="text-base md:text-lg text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: safeData.description }}
            />
          </AnimateItem>
        )}
        {(safeData.primaryCta || safeData.secondaryCta) && (
          <AnimateItem delay={0.5}>
            <div className="flex gap-2 md:gap-3 flex-wrap justify-center pt-4">
              {safeData.primaryCta && (
                <NavigationButton
                  href={safeData.primaryCta.href}
                  label={safeData.primaryCta.label}
                  primary
                  size={'lg'}
                />
              )}
              {safeData.secondaryCta && (
                <NavigationButton
                  href={safeData.secondaryCta.href}
                  label={safeData.secondaryCta.label}
                  size={'lg'}
                />
              )}
            </div>
          </AnimateItem>
        )}
        <AnimateItem delay={0.6}>
          <ScrollArrow />
        </AnimateItem>
      </div>
    </section>
  );
}
