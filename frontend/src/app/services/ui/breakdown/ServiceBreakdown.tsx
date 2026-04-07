'use client';

import React from 'react';
import {
  ServiceBreakdownProps,
  BreakdownItem,
} from '@/app/services/service-page-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { BreakdownCard } from '@/app/services/ui/breakdown/BreakdownCard';
import { TiltCard } from '@/app/home/ui/home-services/parts/TiltCard';

export function ServiceBreakdown({ content }: ServiceBreakdownProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    highlightWord: (content.customData?.highlightWord as string) ?? '',
    items: (content.customData?.items as BreakdownItem[] | undefined) ?? [],
  };

  const renderedTitle = safeData.highlightWord
    ? safeData.title.replace(
        safeData.highlightWord,
        `<span class="text-primary">${safeData.highlightWord}</span>`,
      )
    : safeData.title;

  return (
    <section
      id="breakdown"
      aria-label={safeData.title || 'Szczegóły usługi'}
      className="relative w-full select-none overflow-hidden"
    >
      <div className="relative max-w-[1500px] mx-auto px-4 md:px-10 py-20">
        <div className="flex flex-col gap-10 md:gap-16">
          <AnimateItem>
            <div className="flex flex-col gap-3 max-w-[640px]">
              {safeData.title && (
                <h2
                  className="text-[36px] md:text-[48px] font-bold leading-tight tracking-tight"
                  dangerouslySetInnerHTML={{ __html: renderedTitle }}
                />
              )}
              {safeData.subtitle && (
                <div
                  className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
                />
              )}
            </div>
          </AnimateItem>
          {safeData.items.length > 0 && (
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-[10%] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 80% at 50% 50%, oklch(0.706 0.128 27.786 / 0.15) 0%, transparent 50%)',
                }}
              />
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
                style={{ gridAutoRows: '1fr' }}
                role="list"
                aria-label="Zakres usług"
              >
                {safeData.items.map((item, i) => (
                  <li key={i} className="flex">
                    <TiltCard>
                      <BreakdownCard item={item} index={i} />
                    </TiltCard>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
