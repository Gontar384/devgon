import Image from 'next/image';
import React from 'react';

export function ShortCompanyNote() {
  return (
    <div className="flex items-center gap-3 py-5 px-2.5">
      <Image
        className="pointer-events-none"
        src="/svg/footer/page-designer.svg"
        alt="Programista"
        width={65}
        height={59}
        priority
      />
      <div className="flex flex-col max-w-[350px] gap-1">
        <span className="font-semibold text-sm">devgon</span>
        <span className="text-muted-foreground text-xs">
          Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i
          integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.
        </span>
      </div>
    </div>
  );
}
