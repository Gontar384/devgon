'use client';
import { otherLinks } from '@/app/layout/ui/footer/linksData';
import React from 'react';
import { NavLink } from '@/app/layout/util/NavLink';

export function OtherLinks() {
  return (
    <div
      className="flex flex-wrap text-xs text-muted-foreground gap-4 whitespace-nowrap"
      aria-label="Linki do podstron"
    >
      {otherLinks.map((link) => (
        <NavLink
          key={link.title}
          href={link.href}
          className="cursor-pointer hover:underline active:underline"
        >
          {link.title}
        </NavLink>
      ))}
    </div>
  );
}
