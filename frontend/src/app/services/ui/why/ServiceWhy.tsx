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
  };

  return (
    <section
      id="why"
      aria-label={safeData.title || 'Dlaczego warto'}
      className="w-full border-b"
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_580px] gap-10 xl:gap-20 items-start">
          {/* Left: text header — sticky on desktop */}
          <div className="lg:sticky lg:top-[100px] self-start flex flex-col gap-4">
            <AnimateItem>
              <div className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="text-[12px] uppercase tracking-[0.2em] text-primary font-semibold"
                >
                  Dlaczego my
                </span>
                {safeData.title && (
                  <h2
                    className="text-[30px] md:text-[38px] leading-tight tracking-tight"
                    dangerouslySetInnerHTML={{ __html: safeData.title }}
                  />
                )}
                {safeData.subtitle && (
                  <p className="text-[15px] md:text-[17px] text-muted-foreground leading-relaxed max-w-[440px]">
                    {safeData.subtitle}
                  </p>
                )}
              </div>
            </AnimateItem>

            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="origin-left h-[2px] w-16 bg-primary rounded-full mt-2"
              aria-hidden="true"
            />
          </div>

          {/* Right: cards */}
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
