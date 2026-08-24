import Image from 'next/image';
import React from 'react';
import { MediaType } from '@/cms/content/content-types';
import { CmsPreviewProps } from '@/app/cms/cms-page-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';

export function CmsPreview({ content }: CmsPreviewProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    shots:
      content.media
        ?.filter((item) => item?.url)
        .map((item) => ({
          src: item.url!,
          alt: item.alt ?? '',
          type: item.type ?? MediaType.IMAGE,
        })) ?? [],
  };

  if (!safeData.shots.length) return null;

  return (
    <section
      id="preview"
      aria-label={safeData.title || 'Admin panel'}
      className="relative w-full select-none bg-muted/40 border-y"
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <AnimateItem>
          <div className="flex flex-col gap-3 max-w-[640px] mb-10 md:mb-14">
            {safeData.title && (
              <h2
                className="text-[36px] md:text-[48px] font-bold leading-tight tracking-tight"
                dangerouslySetInnerHTML={{ __html: safeData.title }}
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
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none p-0 m-0">
          {safeData.shots.map((shot, i) => (
            <li key={i} className={i === 0 ? 'md:col-span-2' : undefined}>
              <AnimateItem delay={i * 0.1}>
                <div className="relative w-full overflow-hidden rounded-2xl border bg-background shadow-sm transition duration-300 hover:shadow-lg hover:border-primary/40">
                  {shot.type === MediaType.VIDEO ? (
                    <video
                      src={shot.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      draggable={false}
                      aria-label={shot.alt}
                      className="w-full h-auto pointer-events-none"
                    />
                  ) : (
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={1600}
                      height={900}
                      unoptimized
                      draggable={false}
                      className="w-full h-auto pointer-events-none"
                    />
                  )}
                </div>
              </AnimateItem>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
