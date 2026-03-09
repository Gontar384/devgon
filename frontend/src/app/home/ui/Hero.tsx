import Image from 'next/image';
import React from 'react';
import { MainCardProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';

export function Hero({ content }: MainCardProps) {
  const safeData = {
    title: content?.title ?? '',
    header: content?.header ?? '',
    description: content?.description ?? '',
    photoUrl: content?.media?.[0]?.url ?? '',
    photoAlt: content?.media?.[0]?.alt ?? '',
  };

  if (!content) return null;

  return (
    <section
      className="relative w-full min-h-[80vh] flex items-center overflow-hidden rounded-2xl"
      aria-label={safeData.title}
    >
      {/* Background image with overlay */}
      {safeData.photoUrl && (
        <>
          <Image
            src={safeData.photoUrl}
            alt={safeData.photoAlt}
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />
          {/* Dark gradient overlay — left strong, right transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </>
      )}

      {/* Fallback background when no image */}
      {!safeData.photoUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted" />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl px-6 py-16 md:px-16 md:py-24">
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 break-words ${
            safeData.photoUrl ? 'text-white' : 'text-foreground'
          }`}
        >
          <TypingEffect
            text={safeData.title}
            speed={300}
            deleteSpeed={100}
            pause={1000}
            mode="typing"
          />
        </h1>

        {safeData.header && (
          <div
            className={`max-w-none mb-4 ${
              safeData.photoUrl ? 'text-white/90' : 'text-foreground'
            }`}
            dangerouslySetInnerHTML={{ __html: safeData.header }}
          />
        )}

        {safeData.description && (
          <div
            className={`max-w-none ${
              safeData.photoUrl ? 'text-white/70' : 'text-muted-foreground'
            }`}
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        )}
      </div>
    </section>
  );
}
