import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { ServiceCardProps } from '@/app/home/home-types';
import { MediaType } from '@/cms/content/content-types';

export function ServiceCard({ content }: ServiceCardProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    type: content.media?.[0]?.type ?? MediaType.IMAGE,
    href: content.customData?.href ?? '',
    cta: content.customData?.cta ?? '',
  };

  return (
    <Card
      className="group flex flex-col h-full bg-background border shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-xl"
      aria-label={safeData.title}
    >
      {/* Obraz na górze */}

      {/* Tekst */}
      <CardContent className="flex flex-col flex-1 p-6 gap-4">
        <CardHeader className="p-0">
          <h2
            className="text-2xl md:text-3xl leading-snug"
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
        </CardHeader>

        {safeData.subtitle && (
          <div
            className="text-lg text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
          />
        )}

        {safeData.description && (
          <div
            className="text-base text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        )}

        {safeData.photoUrl && (
          <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden">
            {safeData.type === MediaType.VIDEO ? (
              <video
                src={safeData.photoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image
                src={safeData.photoUrl}
                alt={safeData.photoAlt}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
        )}

        {/* CTA */}
        {safeData.cta && safeData.cta.href && (
          <a
            href={safeData.cta.href}
            className="mt-auto inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-center hover:opacity-90 transition"
          >
            {safeData.cta.label ?? 'Dowiedz się więcej'}
          </a>
        )}
      </CardContent>
    </Card>
  );
}
