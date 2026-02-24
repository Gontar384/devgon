import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { SideCardProps } from '@/app/home/home-types';
import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';

export function SideCard({ content }: SideCardProps) {
  const safeData = {
    title: content?.title ?? '',
    header: content?.header ?? '',
    description: content?.description ?? '',
  };

  if (!content) return null;

  return (
    <Card
      className="card-animate bg-background/95 backdrop-blur border shadow-xl break-words relative overflow-hidden"
      aria-label="Mniejsza karta informacyjna"
    >
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold whitespace-nowrap">
            <TypingEffect text={safeData.title} mode="cursor" />
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: safeData.header }}
      />
      <CardContent
        className="prose prose-sm max-w-none text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: safeData.description }}
      />
    </Card>
  );
}
