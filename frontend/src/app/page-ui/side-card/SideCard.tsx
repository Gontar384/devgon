import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SideHero } from '@/app/page-ui/side-card/SideHero';
import React from 'react';
import { SideCardProps } from '@/app/page-ui/types';
import { CursorGlow } from '@/app/page-ui/parts/CursorGlow';

export function SideCard({ sideHero, description, content }: SideCardProps) {
  return (
    <Card
      className="card-animate bg-background/95 backdrop-blur border shadow-xl wrap-break-word relative overflow-hidden"
      aria-label="Mniejsza karta informacyjna"
    >
      <CursorGlow />
      <CardHeader>
        <CardTitle>
          <SideHero text={sideHero.text} mode={sideHero.mode} />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
