import Image from 'next/image';
import React from 'react';

export function DevgonWatermark() {
  return (
    <div className="flex gap-1.5 items-center justify-center text-xs py-2">
      <span>Designed & built by</span>
      <span className="font-bold">devgon</span>
      <Image
        src="/logo/logo_black.svg"
        alt="Mini logo devgon"
        width={16}
        height={12}
        priority
      />
    </div>
  );
}
