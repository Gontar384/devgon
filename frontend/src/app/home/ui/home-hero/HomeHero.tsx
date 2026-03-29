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
    <section className="flex justify-center items-center w-full min-h-screen relative select-none">
      <div className="backdrop-blur-[14px] absolute inset-0 z-20" />
      <ParticlesBackground id="hero-particles" />
      <div className="flex flex-col items-center justify-center px-6 py-12 gap-2 md:gap-3 text-center relative z-30 max-w-[800px]">
        <AnimateItem delay={0}>
          <h2 className="text-6xl md:text-7xl font-bold">
            <TypingEffect
              text={safeData.typingWord}
              speed={200}
              deleteSpeed={100}
              emptyWordPause={500}
              fullWordPause={3000}
              mode="typing"
            />
          </h2>
        </AnimateItem>
        <AnimateItem delay={0.1}>
          <h1
            className="text-5xl md:text-6xl leading-tight"
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
        </AnimateItem>
        <AnimateItem delay={0.2}>
          <div className="text-3xl md:text-4xl text-primary">
            <RotatingWords words={safeData.heroWords} interval={2500} />
          </div>
        </AnimateItem>
        <AnimateItem delay={0.3}>
          <div
            className="text-xl md:text-2xl"
            dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
          />
        </AnimateItem>
        <AnimateItem delay={0.4}>
          <div
            className="text-base md:text-lg text-muted-foreground "
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        </AnimateItem>
        <AnimateItem delay={0.2}>
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center pt-4">
            {safeData.primaryCta && (
              <NavigationButton
                href={safeData.primaryCta.href}
                label={safeData.primaryCta.label}
                primary
              />
            )}
            {safeData.secondaryCta && (
              <NavigationButton
                href={safeData.secondaryCta.href}
                label={safeData.secondaryCta.label}
              />
            )}
          </div>
        </AnimateItem>
        <AnimateItem delay={0.2}>
          <ScrollArrow />
        </AnimateItem>
      </div>
    </section>
  );
}
