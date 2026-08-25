'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CmsHeroProps } from '@/app/cms/cms-page-types';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { MediaType } from '@/cms/content/content-types';
import Image from 'next/image';

export function CmsHero({ content }: CmsHeroProps) {
  const safeData = {
    title: content.title ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    badge: content.customData?.badge ?? '',
    highlightWord: (content.customData?.highlightWord as string) ?? '',
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

  const renderedTitle = safeData.highlightWord
    ? safeData.title.replace(
        safeData.highlightWord,
        `<span class="text-primary">${safeData.highlightWord}</span>`,
      )
    : safeData.title;

  if (!content) return null;

  return (
    <section
      aria-label={`${safeData.badge} — introduction`}
      className="relative w-full overflow-hidden select-none min-h-screen"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg,   oklch(0.506 0.004 17.282 / 0.1) 0px, oklch(0.506 0.004 17.282 / 0.1) 1px, transparent 1px, transparent 72px)',
            'repeating-linear-gradient(90deg,  oklch(0.506 0.004 17.282 / 0.1) 0px, oklch(0.506 0.004 17.282 / 0.1) 1px, transparent 1px, transparent 72px)',
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
      <div className="relative w-full max-w-[1600px] mx-auto px-4 md:px-10">
        <div className="flex flex-col xl:flex-row xl:items-center xl:gap-[80px] pt-16 md:pt-24 pb-0">
          <div className="flex-1 flex flex-col xl:max-w-[700px]">
            {safeData.badge && (
              <AnimateItem delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 mb-6 w-fit">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="text-[12px] md:text-[13px] uppercase tracking-[0.18em] font-semibold text-primary">
                    {safeData.badge}
                  </span>
                </div>
              </AnimateItem>
            )}
            {safeData.title && (
              <AnimateItem delay={0.08}>
                <h1
                  className="text-[42px] md:text-[58px] xl:text-[68px] font-bold leading-[1.05] tracking-tight mb-4"
                  dangerouslySetInnerHTML={{ __html: renderedTitle }}
                />
              </AnimateItem>
            )}
            {safeData.accentWords.length > 0 && (
              <AnimateItem delay={0.14}>
                <div
                  className="text-[22px] md:text-[28px] text-primary font-semibold mb-5 h-[1.4em] overflow-hidden"
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
                <div
                  className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed max-w-[560px] mb-8"
                  dangerouslySetInnerHTML={{ __html: safeData.description }}
                />
              </AnimateItem>
            )}
            {(safeData.primaryCta || safeData.secondaryCta) && (
              <AnimateItem delay={0.28}>
                <div className="flex gap-3 flex-wrap">
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
          </div>
          {safeData.photoUrl && (
            <AnimateItem delay={0.18}>
              <div className="relative mt-10 xl:mt-0 w-full xl:w-[480px] 2xl:w-[560px] flex items-center justify-center">
                {safeData.mediaType === MediaType.VIDEO ? (
                  <video
                    src={safeData.photoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="relative z-10 w-full max-h-[340px] xl:max-h-none object-contain drop-shadow-xl pointer-events-none"
                    aria-label={safeData.photoAlt || safeData.badge}
                  />
                ) : (
                  <Image
                    src={safeData.photoUrl}
                    alt={safeData.photoAlt}
                    width={560}
                    height={560}
                    priority
                    unoptimized
                    className="relative z-10 w-full max-h-[300px] xl:max-h-none object-contain pointer-events-none"
                  />
                )}
              </div>
            </AnimateItem>
          )}
        </div>
        {safeData.stats.length > 0 && (
          <AnimateItem delay={0.38}>
            <div
              className="flex flex-wrap gap-x-8 gap-y-4 md:gap-x-14 mt-10 md:mt-14 pb-10 md:pb-16 pt-8 md:pt-10"
              role="list"
              aria-label="Key numbers"
            >
              {safeData.stats.map((stat, i) => (
                <div key={i} role="listitem" className="flex flex-col gap-0.5">
                  <span className="text-[30px] md:text-[38px] font-bold text-primary leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[11px] md:text-[13px] text-muted-foreground uppercase tracking-[0.16em]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimateItem>
        )}
      </div>
    </section>
  );
}
