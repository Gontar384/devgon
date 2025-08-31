import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export function SiteLogo() {
  return (
    <Link
      href="/"
      className="ml-4 select-none flex-shrink-0 animate-logo"
      aria-label="Strona główna"
    >
      <Image
        src={'/logo/logo_caption_black.svg'}
        alt=""
        width={80}
        height={60}
        priority
      />
    </Link>
  );
}
