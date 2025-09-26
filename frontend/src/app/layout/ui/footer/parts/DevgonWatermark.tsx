import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

export function DevgonWatermark() {
  return (
    <div className="flex gap-1.5 items-center justify-center text-xs py-2">
      <span>Designed & built by</span>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://devgon.site"
        className="font-bold underline"
      >
        devgon
      </Link>
      <Image
        src="/logo/logo-black.svg"
        alt="Mini logo devgon"
        width={16}
        height={12}
        priority
      />
    </div>
  );
}
