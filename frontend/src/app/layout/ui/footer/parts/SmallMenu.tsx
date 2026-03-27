'use client';
import { smallMenu } from '@/app/layout/ui/footer/linksData';
import Link from 'next/link';
import React from 'react';
import { useNavigation } from '@/app/layout/ui/navbar/useNavigation';

export function SmallMenu() {
  const { navigateTo, navigateToTop } = useNavigation();

  return (
    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
      <div className="font-semibold">Nawigacja</div>
      <div
        className="flex flex-col justify-center gap-0.5 whitespace-nowrap"
        aria-label="Nawigacja"
      >
        {smallMenu.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              link.href === '/' ? navigateToTop() : navigateTo(link.href);
            }}
            className="cursor-pointer hover:underline active:underline"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
