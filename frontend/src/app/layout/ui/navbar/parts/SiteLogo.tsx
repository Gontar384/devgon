'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useSmoothScrollTo } from '@/app/layout/ui/navbar/main-menu-bar/useSmoothScrollTo';

export function SiteLogo() {
  const { closeBar, setScrollingToAnchor } = useMobileBarStore();
  const scrollTo = useSmoothScrollTo();

  const handleClick = () => {
    setScrollingToAnchor(true);
    closeBar();
    scrollTo('start');
  };

  return (
    <Link
      href="/#start"
      onClick={handleClick}
      className="ml-4 select-none flex-shrink-0"
    >
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
