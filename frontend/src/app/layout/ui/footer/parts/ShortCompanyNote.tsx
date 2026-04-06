import Image from 'next/image';
import React from 'react';
import { shortNote } from '@/app/layout/util/data/footerData';

export function ShortCompanyNote() {
  return (
    <div className="flex gap-4">
      <Image
        className="pointer-events-none h-fit"
        src={shortNote.imageSrc}
        alt={shortNote.imageAlt}
        width={shortNote.imageW}
        height={shortNote.imageH}
      />
      <div className="flex flex-col max-w-[400px] gap-2 text-sm text-muted-foreground">
        <span className="font-semibold">{shortNote.title}</span>
        <span>{shortNote.description}</span>
      </div>
    </div>
  );
}
