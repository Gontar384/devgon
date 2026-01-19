import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SideHero } from '@/app/home/ui/side-card/SideHero';
import React from 'react';
import { SideCardProps } from '@/app/home/util/types';

export function SideCard({ sideHero, description, content }: SideCardProps) {
  return (
    <Card
      className="card-animate bg-background/95 backdrop-blur border shadow-xl wrap-break-word relative overflow-hidden"
      aria-label="Mniejsza karta informacyjna"
    >
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
