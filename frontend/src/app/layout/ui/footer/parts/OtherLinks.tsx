'use client';
import { otherLinks } from '@/app/layout/ui/footer/linksData';
import Link from 'next/link';
import React from 'react';
import { useNavigation } from '@/app/layout/ui/navbar/useNavigation';

export function OtherLinks() {
  const { navigateTo } = useNavigation();

  return (
    <div
      className="flex flex-wrap text-xs text-muted-foreground gap-4 whitespace-nowrap"
      aria-label="Linki do podstron"
    >
      {otherLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            navigateTo(link.href);
          }}
          className="cursor-pointer hover:underline active:underline"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}
