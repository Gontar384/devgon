import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { AboutMainCardProps } from '@/app/about/util/types';

export function AboutMainCard({
  title,
  description,
  editable,
}: AboutMainCardProps) {
  return (
    <Card
      className="card-animate bg-background/95 backdrop-blur border shadow-xl wrap-break-word relative overflow-hidden"
      aria-label={title}
    >
      <CursorGlow />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
    </Card>
  );
}
