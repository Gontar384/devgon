'use client';
import React from 'react';
import { useNavigation } from '@/app/layout/util/useNavigation';
import { NavigationButtonProps } from '@/app/home/home-types';
import Link from 'next/link';

const sizeClasses = {
  sm: 'text-xs md:text-sm px-3 md:px-4 py-3',
  md: 'text-sm md:text-base px-4 md:px-5 py-3.5',
  lg: 'text-base md:text-lg px-5 md:px-6 py-4',
};

export function NavigationButton({
  href,
  label,
  primary = false,
  icon,
  size = 'md',
  ariaLabel,
}: NavigationButtonProps) {
  const { navigateTo } = useNavigation();

  const baseClasses = `inline-flex items-center justify-center gap-2.5 rounded-lg cursor-pointer transition duration-200 hover:scale-105 active:scale-105 ${sizeClasses[size]}`;
  const primaryClasses = 'bg-primary text-primary-foreground';
  const secondaryClasses = 'border';

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(href);
      }}
      aria-label={ariaLabel}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
    >
      {label}
      {icon}
    </Link>
  );
}
