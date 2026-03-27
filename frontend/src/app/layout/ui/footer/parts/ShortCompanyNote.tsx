import Image from 'next/image';
import React from 'react';

export function ShortCompanyNote() {
  return (
    <div className="flex gap-4">
      <Image
        className="pointer-events-none h-fit"
        src="/svg/footer/page-designer.svg"
        alt="Programista"
        width={92}
        height={84}
      />
      <div className="flex flex-col max-w-[400px] gap-2 text-sm text-muted-foreground">
        <span className="font-semibold">devgon</span>
        <span>
          Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i
          integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.
        </span>
      </div>
    </div>
  );
}
