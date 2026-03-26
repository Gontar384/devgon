import Image from 'next/image';
import React from 'react';

export function AllRightsReserved() {
  return (
    <div className="flex items-center gap-4 pr-12">
      <Image
        className="pointer-events-none"
        src="/svg/footer/page-designer.svg"
        alt="Programista"
        width={50}
        height={46}
        priority
      />
      <div className="flex flex-col text-sm text-muted-foreground whitespace-nowrap">
        <span>© 2026 devgon</span>
        <span>Wszystkie prawa zastrzeżone</span>
      </div>
    </div>
  );
}
