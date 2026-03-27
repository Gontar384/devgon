import { otherLinks } from '@/app/layout/ui/footer/linksData';
import Link from 'next/link';
import React from 'react';

export function OtherLinks() {
  return (
    <div
      className="flex flex-wrap justify-center md:justify-start text-xs text-muted-foreground gap-4 whitespace-nowrap"
      aria-label="Linki do podstron"
    >
      {otherLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className="cursor-pointer hover:underline active:underline"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}
