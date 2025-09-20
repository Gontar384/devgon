import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import layoutData from '@/app/layout-ui/layoutData.json';
import { DevgonWatermarkData } from '@/app/layout-ui/types';

export function DevgonWatermark() {
  const typedDevgonWatermarkData: DevgonWatermarkData =
    layoutData.devgonWatermark;

  return (
    <div className="flex gap-1.5 items-center justify-center text-xs py-2">
      <span>{typedDevgonWatermarkData.content}</span>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={typedDevgonWatermarkData.href}
        className="font-bold underline"
      >
        {typedDevgonWatermarkData.content1}
      </Link>
      <Image
        src={typedDevgonWatermarkData.imageSrc}
        alt={typedDevgonWatermarkData.imageAlt}
        width={typedDevgonWatermarkData.imageW}
        height={typedDevgonWatermarkData.imageH}
        priority
      />
    </div>
  );
}
