import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { HomeServiceCardProps } from '@/app/home/home-types';
import { MediaType } from '@/cms/content/content-types';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const CARD_HEIGHT = 650;
const PHOTO_HEIGHT = 260;
const CTA_HEIGHT = 48;

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
    type: content.media?.[0]?.type ?? MediaType.IMAGE,
    cta: content.customData?.cta ?? '',
    tags: content.customData?.tags ?? [],
  };

  return (
    <Card
      className="w-full flex flex-col bg-background border transition-all duration-300 overflow-hidden rounded-xl"
      style={{ height: CARD_HEIGHT }}
      aria-label={safeData.title}
    >
      <CardContent className="flex flex-col h-full px-5 pb-5 pt-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 flex-shrink-0 overflow-hidden">
          {safeData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-[26px] mb-0.5">
              {safeData.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <CardHeader className="p-0">
            <h2
              className="text-[24px] md:text-[28px] font-semibold leading-snug line-clamp-2"
              dangerouslySetInnerHTML={{ __html: safeData.title }}
            />
          </CardHeader>
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
            >
              {safeData.type === MediaType.VIDEO ? (
                <video
                  src={safeData.photoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  draggable={false}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 select-none"
                />
              ) : (
                <Image
                  src={safeData.photoUrl}
                  alt={safeData.photoAlt}
                  fill
                  unoptimized
                  priority={priority}
                  draggable={false}
                  className="object-cover transition-transform duration-500 select-none"
                />
              )}
            </div>
          )}
          {safeData.cta && safeData.cta.href && (
            <Link
              href={safeData.cta.href}
              className="flex-shrink-0 flex items-center justify-center gap-3 w-full px-6 text-[13px] md:text-[14px] rounded-lg bg-primary text-primary-foreground hover:scale-105 active:scale-105 transition duration-200"
              style={{ height: CTA_HEIGHT }}
            >
              <span className="truncate">
                {safeData.cta.label ?? 'Dowiedz się więcej'}
              </span>
              <ExternalLink size={16} className="shrink-0" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
