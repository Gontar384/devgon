'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useNavigation } from '@/app/layout/ui/navbar/useNavigation';

export function SiteLogo() {
  const { navigateToTop } = useNavigation();

  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        navigateToTop();
      }}
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
