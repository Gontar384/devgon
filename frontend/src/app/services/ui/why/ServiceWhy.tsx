'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ServiceWhyProps, WhyItem } from '@/app/services/service-page-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { WhyCard } from '@/app/services/ui/why/WhyCard';

export function ServiceWhy({ content }: ServiceWhyProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    items: (content.customData?.items as WhyItem[] | undefined) ?? [],
    topHeader: content.customData?.topHeader ?? '',
    highlightWord: (content.customData?.highlightWord as string) ?? '',
  };

  const renderedTitle = safeData.highlightWord
    ? safeData.title.replace(
        safeData.highlightWord,
        `<span class="text-primary">${safeData.highlightWord}</span>`,
      )
    : safeData.title;

  return (
    <section
      id="why"
      aria-label={safeData.title || 'Dlaczego warto'}
      className="w-full select-none relative [clip-path:inset(0)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg,   oklch(0.506 0.004 17.282 / 0.15) 0px, oklch(0.506 0.004 17.282 / 0.15) 1px, transparent 1px, transparent 50px)',
            'repeating-linear-gradient(90deg,  oklch(0.506 0.004 17.282 / 0.15) 0px, oklch(0.506 0.004 17.282 / 0.15) 1px, transparent 1px, transparent 50px)',
            'repeating-linear-gradient(45deg,  oklch(0.506 0.004 17.282 / 0.15) 0px, oklch(0.506 0.004 17.282 / 0.15) 1px, transparent 1px, transparent 50px)',
            'repeating-linear-gradient(135deg, oklch(0.506 0.004 17.282 / 0.15) 0px, oklch(0.506 0.004 17.282 / 0.15) 1px, transparent 1px, transparent 50px)',
          ].join(', '),
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, transparent, oklch(0.812 0.01 106.613))',
        }}
      />
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_580px] gap-10 xl:gap-20 items-start">
          <div className="lg:sticky lg:top-[100px] self-start flex flex-col gap-4">
            <AnimateItem>
              <div className="flex flex-col gap-3">
                {safeData.topHeader && (
                  <span
                    aria-hidden="true"
                    className="text-[18px] md:text-[20px] uppercase tracking-[0.18em] text-primary font-semibold"
                  >
                    {safeData.topHeader}
                  </span>
                )}
                {safeData.title && (
                  <h2
                    className="text-[36px] md:text-[48px] leading-tight tracking-tight"
                    dangerouslySetInnerHTML={{ __html: renderedTitle }}
                  />
                )}
                {safeData.subtitle && (
                  <div
                    className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed max-w-[440px]"
                    dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
                  />
                )}
              </div>
            </AnimateItem>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="origin-left h-[2px] w-16 bg-primary rounded-full mt-2"
              aria-hidden="true"
            />
          </div>
          {safeData.items.length > 0 && (
            <ul
              className="flex flex-col gap-4 list-none p-0 m-0"
              role="list"
              aria-label="Powody by wybrać nasze usługi"
            >
              {safeData.items.map((item, i) => (
                <li key={i}>
                  <WhyCard item={item} index={i} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
