'use client';
import React from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { AboutMainCardProps } from '@/app/about/about-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AboutMainCard({ title, description }: AboutMainCardProps) {
  return (
    <Card
      className="bg-background/95 backdrop-blur wrap-break-word relative overflow-hidden shadow-xl"
      aria-label={title}
    >
      <CursorGlow />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0 pr-4">
          <h2
            className="text-2xl font-semibold break-words"
            dangerouslySetInnerHTML={{ __html: title ?? '' }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description ?? '' }}
        />
      </CardContent>
    </Card>
  );
}
