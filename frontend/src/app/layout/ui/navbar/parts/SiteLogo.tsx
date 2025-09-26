import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export function SiteLogo() {
  return (
    <Link href="/" className="ml-4 select-none flex-shrink-0">
      <Image
        src="/logo/logo-caption-black.svg"
        alt="Logo strony głównej"
        width={80}
        height={60}
        priority
      />
    </Link>
  );
}
