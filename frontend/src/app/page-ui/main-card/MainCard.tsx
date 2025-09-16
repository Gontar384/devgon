import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MainHero } from '@/app/page-ui/main-card/MainHero';
import Image from 'next/image';
import React from 'react';
import { MainCardProps } from '@/app/page-ui/types';
import { CursorGlow } from '@/app/page-ui/parts/CursorGlow';

export function MainCard({
  mainHero,
  description,
  content,
  imageSrc,
  imageAlt,
  imageW,
  imageH,
}: MainCardProps) {
  return (
    <Card
      className="card-animate bg-background/90 backdrop-blur border shadow-xl wrap-break-word px-2 md:px-6 relative overflow-hidden"
      aria-label="Główna karta informacyjna"
    >
      <CursorGlow />
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>
              <MainHero
                text={mainHero.text}
                speed={mainHero.speed}
                deleteSpeed={mainHero.deleteSpeed}
                pause={mainHero.pause}
                mode={mainHero.mode}
              />
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{content}</CardContent>
        </div>
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageW}
            height={imageH}
            priority
            className="rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
}
