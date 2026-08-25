'use client';
import Image from 'next/image';
import React from 'react';
import { useNavigation } from '@/app/layout/util/useNavigation';
import { NavLink } from '@/app/layout/util/NavLink';

export function SiteLogo() {
  const { navigateToTop } = useNavigation();

  return (
    <NavLink
      href="/"
      onNavigate={navigateToTop}
      className="ml-4 select-none flex-shrink-0"
      aria-label="Go to the home page"
    >
      <Image
        src="/logo/logo-caption-black.svg"
        alt="Site logo"
        width={80}
        height={60}
        priority
      />
    </NavLink>
  );
}
