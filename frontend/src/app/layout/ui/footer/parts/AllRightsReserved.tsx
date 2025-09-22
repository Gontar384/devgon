import Image from 'next/image';
import React from 'react';
import { AllRightsReservedData } from '@/app/layout/util/types';
import layoutData from '@/app/layout/util/layoutData.json';

export function AllRightsReserved() {
  const typedAllRightsReservedData: AllRightsReservedData =
    layoutData.allRightsReserved;

  return (
    <div className="flex items-center gap-4 pr-12">
      <Image
        src={typedAllRightsReservedData.imageSrc}
        alt={typedAllRightsReservedData.imageAlt}
        width={typedAllRightsReservedData.imageW}
        height={typedAllRightsReservedData.imageH}
        priority
      />
      <div className="flex flex-col text-sm text-muted-foreground whitespace-nowrap">
        <span>{typedAllRightsReservedData.content}</span>
        <span>{typedAllRightsReservedData.content1}</span>
      </div>
    </div>
  );
}
