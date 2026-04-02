'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceHeroProps } from '@/app/services/service-page-types';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { MediaType } from '@/cms/content/content-types';
import Image from 'next/image';

export function ServiceHero({ content }: ServiceHeroProps) {
  const safeData = {
    title: content.title ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    badge: content.customData?.badge ?? '',
    accentWords: (content.customData?.accentWords as string[]) ?? [],
    primaryCta: content.customData?.primaryCta ?? null,
    secondaryCta: content.customData?.secondaryCta ?? null,
    stats:
      (content.customData?.stats as { value: string; label: string }[]) ?? [],
  };

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (safeData.accentWords.length <= 1) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % safeData.accentWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [safeData.accentWords.length]);

  if (!content) return null;

  return (
    <section
      aria-label={`${safeData.badge} — sekcja powitalna`}
      className="relative min-h-screen w-full flex items-center pb-16 md:pb-24 overflow-hidden border-b select-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'linear-gradient(to right, oklch(0.506 0.004 17.282 / 0.3) 1px, transparent 1px)',
            'linear-gradient(to bottom, oklch(0.506 0.004 17.282 / 0.3) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '72px 72px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.706 0.128 27.786 / 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, oklch(0.812 0.01 106.613))',
        }}
      />
      <div className="relative w-full max-w-[1600px] items-center mx-auto px-4 md:px-10 mt-10 flex flex-col xl:flex-row gap-[40px] xl:gap-[70px]">
        <div className="max-w-[900px] flex flex-col">
          {safeData.badge && (
            <AnimateItem delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 mb-6">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-[12px] md:text-[14px] uppercase tracking-[0.18em] font-semibold text-primary">
                  {safeData.badge}
                </span>
              </div>
            </AnimateItem>
          )}
          {safeData.title && (
            <AnimateItem delay={0.08}>
              <h1
                className="text-[50px] md:text-[70px] font-bold leading-[1.05] tracking-tight mb-4"
                dangerouslySetInnerHTML={{ __html: safeData.title }}
              />
            </AnimateItem>
          )}
          {safeData.accentWords.length > 0 && (
            <AnimateItem delay={0.14}>
              <div
                className="text-[24px] md:text-[32px] text-primary font-semibold mb-5 h-[1.4em] overflow-hidden"
                aria-live="polite"
                aria-atomic="true"
              >
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="block uppercase tracking-[0.12em]"
                >
                  {safeData.accentWords[wordIndex]}
                </motion.span>
              </div>
            </AnimateItem>
          )}
          {safeData.description && (
            <AnimateItem delay={0.2}>
              <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed max-w-[600px] mb-8">
                {safeData.description}
              </p>
            </AnimateItem>
          )}
          {(safeData.primaryCta || safeData.secondaryCta) && (
            <AnimateItem delay={0.28}>
              <div className="flex gap-3 flex-wrap mb-12 md:mb-16">
                {safeData.primaryCta && (
                  <NavigationButton
                    href={safeData.primaryCta.href}
                    label={safeData.primaryCta.label}
                    primary
                    icon={<ArrowRight size={18} aria-hidden="true" />}
                    size="lg"
                  />
                )}
                {safeData.secondaryCta && (
                  <NavigationButton
                    href={safeData.secondaryCta.href}
                    label={safeData.secondaryCta.label}
                    size="lg"
                  />
                )}
              </div>
            </AnimateItem>
          )}
          {safeData.stats.length > 0 && (
            <AnimateItem delay={0.36}>
              <div
                className="flex flex-wrap gap-6 md:gap-10"
                role="list"
                aria-label="Kluczowe liczby"
              >
                {safeData.stats.map((stat, i) => (
                  <div
                    key={i}
                    role="listitem"
                    className="flex flex-col gap-0.5"
                  >
                    <span className="text-[28px] md:text-[36px] font-bold text-primary leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[12px] md:text-[14px] text-muted-foreground uppercase tracking-[0.14em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </AnimateItem>
          )}
        </div>
        {safeData.photoUrl && (
          <AnimateItem delay={0.2}>
            <div className="max-w-[500px] xl:max-w-[700px]">
              {safeData.mediaType === MediaType.VIDEO ? (
                <video
                  src={safeData.photoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="object-contain w-full h-full"
                  aria-label={safeData.photoAlt || safeData.badge}
                />
              ) : (
                <Image
                  src={safeData.photoUrl}
                  alt={safeData.photoAlt}
                  width={400}
                  height={400}
                  priority
                  unoptimized
                  className="object-contain w-full h-full"
                />
              )}
            </div>
          </AnimateItem>
        )}
      </div>
    </section>
  );
}
