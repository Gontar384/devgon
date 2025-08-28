'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export function SiteLogo() {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href="/"
      className="ml-5 mr-3 select-none flex-shrink-0 animate-logo"
      aria-label="Strona główna"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      onClick={() => setHover(false)}
    >
      <Image
        src={
          hover
            ? '/logo/logo_caption_color.svg'
            : '/logo/logo_caption_black.svg'
        }
        alt=""
        width={80}
        height={60}
        priority
      />
    </Link>
  );
}
