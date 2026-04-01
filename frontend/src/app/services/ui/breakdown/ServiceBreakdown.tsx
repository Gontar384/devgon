'use client';

import React from 'react';
import {
  ServiceBreakdownProps,
  BreakdownItem,
} from '@/app/services/service-page-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { BreakdownCard } from '@/app/services/ui/breakdown/BreakdownCard';

export function ServiceBreakdown({ content }: ServiceBreakdownProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    items: (content.customData?.items as BreakdownItem[] | undefined) ?? [],
  };

  return (
    <section
      id="breakdown"
      aria-label={safeData.title || 'Szczegóły usługi'}
      className="w-full border-b"
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="flex flex-col gap-10 md:gap-16">
          <AnimateItem>
            <div className="flex flex-col gap-3 max-w-[640px]">
              {safeData.title && (
                <h2
                  className="text-[30px] md:text-[38px] leading-tight tracking-tight"
                  dangerouslySetInnerHTML={{ __html: safeData.title }}
                />
              )}
              {safeData.subtitle && (
                <p className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed">
                  {safeData.subtitle}
                </p>
              )}
            </div>
          </AnimateItem>

          {safeData.items.length > 0 && (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
              role="list"
              aria-label="Zakres usług"
            >
              {safeData.items.map((item, i) => (
                <li key={i}>
                  <BreakdownCard item={item} index={i} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
