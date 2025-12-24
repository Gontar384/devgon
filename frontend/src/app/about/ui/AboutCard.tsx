'use client';
import React from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AboutCardProps } from '@/app/about/about-types';

export function AboutCard({ content }: AboutCardProps) {
  const safeData = {
    title: content?.title ?? '',
    header: content?.header ?? '',
    description: content?.description ?? '',
  };

  return (
    <Card
      className="bg-background/95 backdrop-blur wrap-break-word relative overflow-hidden shadow-xl"
      aria-label={safeData.title ?? 'Karta treści'}
    >
      <CursorGlow />
      <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0 pr-4">
          <h2
            className="text-2xl font-semibold break-words"
            dangerouslySetInnerHTML={{
              __html: safeData.title !== '' ? safeData.title : '<...>',
            }}
          />
        </div>
      </CardTitle>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0 pr-4">
          <h2
            className="text-2xl font-semibold break-words"
            dangerouslySetInnerHTML={{
              __html: safeData.header !== '' ? safeData.header : '<...>',
            }}
          />
        </div>
      </CardHeader>
      <CardDescription className="pt-2">
        <div
          className="leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              safeData.description !== '' ? safeData.description : '<...>',
          }}
        />
      </CardDescription>
    </Card>
  );
}
