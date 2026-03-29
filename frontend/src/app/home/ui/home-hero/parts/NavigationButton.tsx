'use client';
import React from 'react';
import { useNavigation } from '@/app/layout/util/useNavigation';
import { NavigationButtonProps } from '@/app/home/home-types';
import Link from 'next/link';

export function NavigationButton({
  href,
  label,
  primary = false,
  icon,
}: NavigationButtonProps) {
  const { navigateTo } = useNavigation();

  const baseClasses =
    'inline-flex items-center gap-2.5 text-base md:text-lg px-4 md:px-6 py-3 rounded-lg cursor-pointer transition duration-200 hover:scale-105 active:scale-105';
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
      {icon}
    </Link>
  );
}
