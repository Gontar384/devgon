import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { HomeServiceCardProps } from '@/app/home/home-types';
import { MediaType } from '@/cms/content/content-types';
import { ExternalLink } from 'lucide-react';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';

const CARD_HEIGHT = 675;
const PHOTO_HEIGHT = 270;
const TEXT_HEIGHT = 280;

export function HomeServiceCard({
  content,
  priority = false,
}: HomeServiceCardProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    cta: content.customData?.cta ?? null,
    tags: content.customData?.tags ?? [],
  };

  return (
    <Card
      className="w-full flex flex-col bg-background border transition-all duration-300 overflow-hidden rounded-xl select-none"
      style={{ height: CARD_HEIGHT }}
    >
      <CardContent className="flex flex-col h-full px-5 pb-5 pt-2 overflow-hidden">
        <div
          className="flex flex-col gap-1.5 flex-shrink-0 overflow-hidden"
          style={{ height: TEXT_HEIGHT }}
        >
          {safeData.tags.length > 0 && (
            <ul
              aria-label="Kategorie"
              className="flex flex-wrap gap-1.5 overflow-hidden max-h-[26px] mb-0.5 list-none p-0 m-0"
            >
              {safeData.tags.slice(0, 3).map((tag: string, i: number) => (
                <li
                  key={i}
                  className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {safeData.title && (
            <CardHeader className="p-0">
              <h3
                className="text-[24px] md:text-[28px] font-semibold leading-snug line-clamp-2"
                dangerouslySetInnerHTML={{ __html: safeData.title }}
              />
            </CardHeader>
          )}
          {safeData.subtitle && (
            <div
              className="text-[15px] md:text-[16px] leading-snug text-muted-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
            />
          )}
          {safeData.description && (
            <div
              className="text-[14px] md:text-[15px] leading-relaxed text-muted-foreground line-clamp-5"
              dangerouslySetInnerHTML={{ __html: safeData.description }}
            />
          )}
        </div>
        <div className="mt-auto flex flex-col gap-3 flex-shrink-0">
          {safeData.photoUrl && (
            <div
              className="relative w-full flex-shrink-0 overflow-hidden rounded-xl"
              style={{ height: PHOTO_HEIGHT }}
              aria-hidden="true"
            >
              {safeData.mediaType === MediaType.VIDEO ? (
                <video
                  src={safeData.photoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  draggable={false}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 pointer-events-none"
                />
              ) : (
                <Image
                  src={safeData.photoUrl}
                  alt={safeData.photoAlt}
                  fill
                  unoptimized
                  priority={priority}
                  draggable={false}
                  className="object-cover transition-transform duration-500 pointer-events-none"
                />
              )}
            </div>
          )}
          {safeData.cta?.href && (
            <NavigationButton
              href={safeData.cta.href}
              label={safeData.cta.label ?? 'Dowiedz się więcej'}
              icon={
                <ExternalLink
                  size={16}
                  className="shrink-0"
                  aria-hidden="true"
                />
              }
              primary
              size={'md'}
              ariaLabel={`${safeData.cta.label ?? 'Dowiedz się więcej'} — ${safeData.title}`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
