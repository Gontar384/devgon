import React from 'react';
import { RotatingWords } from '@/app/home/ui/parts/RotatingWords';
import { HomeHeroProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';
import Link from 'next/link';
import { ParticlesBackground } from '@/components/extra/ParticlesBackground';
import { AnimateItem } from '@/app/home/ui/parts/animations/AnimateItem';
import { ScrollArrow } from '@/app/home/ui/parts/ScrollArrow';

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
      <div className="flex flex-col items-center justify-center px-6 py-12 gap-6 text-center relative z-30 max-w-[800px]">
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
        <AnimateItem delay={0.2}>
          <h1
            className="text-5xl md:text-6xl leading-tight"
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
        </AnimateItem>
        <AnimateItem delay={0.4}>
          <div className="text-3xl md:text-4xl text-primary">
            <RotatingWords words={safeData.heroWords} interval={2500} />
          </div>
        </AnimateItem>
        <AnimateItem delay={0.6}>
          <div
            className="text-xl md:text-2xl"
            dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
          />
        </AnimateItem>
        <AnimateItem delay={0.8}>
          <div
            className="text-base md:text-lg text-muted-foreground "
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        </AnimateItem>
        <AnimateItem delay={1.0}>
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center pt-4">
            {safeData.primaryCta && (
              <Link
                href={safeData.primaryCta.href}
                className="text-base md:text-lg px-4 md:px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:scale-105 active:scale-105 trasition duration-200"
              >
                {safeData.primaryCta.label}
              </Link>
            )}
            {safeData.secondaryCta && (
              <Link
                href={safeData.secondaryCta.href}
                className="text-base md:text-lg px-4 md:px-6 py-3 rounded-lg border cursor-pointer hover:scale-105 active:scale-105 trasition duration-200"
              >
                {safeData.secondaryCta.label}
              </Link>
            )}
          </div>
        </AnimateItem>
        <AnimateItem delay={1.2}>
          <ScrollArrow />
        </AnimateItem>
      </div>
    </section>
  );
}
