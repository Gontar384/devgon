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

export const MainCard: React.FC<MainCardProps> = ({
  title,
  description,
  content,
  imageSrc,
  imageW,
  imageH,
}) => {
  return (
    <Card className="card-animate bg-background/80 backdrop-blur border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word px-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>
              <MainHero text={title} />
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{content}</CardContent>
        </div>
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt={`${title} image`}
            width={imageW}
            height={imageH}
            priority
            className="rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
};
