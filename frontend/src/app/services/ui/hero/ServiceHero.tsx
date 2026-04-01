'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceHeroProps } from '@/app/services/service-page-types';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';

export function ServiceHero({ content }: ServiceHeroProps) {
  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    description: content.description ?? '',
    badge: content.customData?.badge ?? '',
    primaryCta: content.customData?.primaryCta ?? null,
    secondaryCta: content.customData?.secondaryCta ?? null,
    stats:
      (content.customData?.stats as { value: string; label: string }[]) ?? [],
    accentWords: (content.customData?.accentWords as string[]) ?? [],
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
      aria-label={`${safeData.subtitle} — sekcja powitalna`}
      className="relative w-full min-h-[92vh] flex items-end pb-16 md:pb-24 overflow-hidden border-b"
    >
      {/* Grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border)/0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.4) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* Radial gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary)/0.08) 0%, transparent 70%)',
        }}
      />
      {/* Fade to bg at bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, hsl(var(--background)))',
        }}
      />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 md:px-10">
        <div className="max-w-[860px]">
          {safeData.badge && (
            <AnimateItem delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 mb-6">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-[12px] uppercase tracking-[0.18em] font-semibold text-primary">
                  {safeData.badge}
                </span>
              </div>
            </AnimateItem>
          )}

          {safeData.title && (
            <AnimateItem delay={0.08}>
              <h1
                className="text-[40px] md:text-[60px] lg:text-[72px] font-bold leading-[1.05] tracking-tight mb-4"
                dangerouslySetInnerHTML={{ __html: safeData.title }}
              />
            </AnimateItem>
          )}

          {safeData.accentWords.length > 0 && (
            <AnimateItem delay={0.14}>
              <div
                className="text-[22px] md:text-[30px] text-primary font-semibold mb-5 h-[1.4em] overflow-hidden"
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
                    <span className="text-[12px] text-muted-foreground uppercase tracking-[0.14em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </AnimateItem>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#breakdown"
        aria-label="Przewiń do szczegółów usługi"
        className="absolute bottom-7 right-8 hidden md:flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <span className="text-[10px] uppercase tracking-[0.18em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} aria-hidden="true" />
        </motion.div>
      </motion.a>
    </section>
  );
}
