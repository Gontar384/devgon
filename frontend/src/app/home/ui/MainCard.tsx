import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import { MainCardProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';

export function MainCard({ content }: MainCardProps) {
  const safeData = {
    title: content?.title ?? '',
    header: content?.header ?? '',
    description: content?.description ?? '',
    photoUrl: content?.media?.[0]?.url ?? '',
    photoAlt: content?.media?.[0]?.alt ?? '',
  };

  if (!content) return null;

  return (
    <Card
      className="card-animate bg-background/90 backdrop-blur border shadow-xl break-words px-2 md:px-6 relative overflow-hidden"
      aria-label={safeData.title}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <CardHeader>
            <CardTitle>
              <h1 className="text-6xl font-bold whitespace-nowrap">
                <TypingEffect
                  text={safeData.title}
                  speed={300}
                  deleteSpeed={100}
                  pause={1000}
                  mode="typing"
                />
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent
            className="prose prose-sm max-w-none text-2xl py-4"
            dangerouslySetInnerHTML={{ __html: safeData.header }}
          />
          <CardContent
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        </div>
        <div className="flex-shrink-0">
          {safeData.photoUrl && (
            <Image
              src={safeData.photoUrl}
              alt={safeData.photoAlt}
              width={400}
              height={400}
              unoptimized
              priority
              className="rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
