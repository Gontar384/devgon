import React from 'react';
import { RotatingWords } from '@/app/home/ui/parts/RotatingWords';
import { HeroProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';

export function Hero({ content }: HeroProps) {
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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* tło */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />

      {/* subtle glow */}
      <div className="absolute top-[-200px] left-[50%] w-[900px] h-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 max-w-3xl px-6 text-center flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-6xl font-bold break-words">
          <TypingEffect
            text={safeData.typingWord}
            speed={300}
            deleteSpeed={100}
            pause={1000}
            mode="typing"
          />
        </h1>
        {/* TITLE */}
        <h2
          className="text-4xl md:text-6xl lg:text-7xl leading-tight"
          dangerouslySetInnerHTML={{ __html: safeData.title }}
        />

        {/* ROTATING WORDS */}
        <div className="text-3xl md:text-4xl font-semibold text-primary min-h-[1.4em]">
          <RotatingWords words={safeData.heroWords} />
        </div>

        {/* SUBTITLE */}
        <div
          className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
        />

        {/* DESCRIPTION */}
        <div
          className="text-base text-muted-foreground max-w-xl"
          dangerouslySetInnerHTML={{ __html: safeData.description }}
        />

        {/* CTA */}
        <div className="flex gap-4 flex-wrap justify-center pt-4">
          {safeData.primaryCta && (
            <a
              href={safeData.primaryCta.href}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              {safeData.primaryCta.label}
            </a>
          )}

          {safeData.secondaryCta && (
            <a
              href={safeData.secondaryCta.href}
              className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition"
            >
              {safeData.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
