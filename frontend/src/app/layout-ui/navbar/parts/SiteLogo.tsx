import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import layoutData from '@/app/layout-ui/layoutData.json';
import { SiteLogoData } from '@/app/layout-ui/types';

export function SiteLogo() {
  const typedLayoutData: SiteLogoData = layoutData.siteLogo;

  return (
    <Link
      href={typedLayoutData.href}
      className="ml-4 select-none flex-shrink-0 animate-logo"
    >
      <Image
        src={typedLayoutData.imageSrc}
        alt={typedLayoutData.imageAlt}
        width={typedLayoutData.imageW}
        height={typedLayoutData.imageH}
        priority
      />
    </Link>
  );
}
