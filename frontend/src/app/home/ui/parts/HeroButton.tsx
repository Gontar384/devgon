'use client';
import React from 'react';
import { useNavigation } from '@/app/layout/ui/navbar/useNavigation';
import { HeroButtonProps } from '@/app/home/home-types';
import Link from 'next/link';

export function HeroButton({ href, label, primary = false }: HeroButtonProps) {
  const { navigateTo } = useNavigation();

  const baseClasses =
    'text-base md:text-lg px-4 md:px-6 py-3 rounded-lg cursor-pointer transition duration-200 hover:scale-105 active:scale-105';
  const primaryClasses = 'bg-primary text-primary-foreground';
  const secondaryClasses = 'border';

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(href);
      }}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
    >
      {label}
    </Link>
  );
}
