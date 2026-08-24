'use client';
import React from 'react';
import { NavLink } from '@/app/layout/util/NavLink';
import { otherLinks } from '@/app/layout/util/data/footerData';

export function OtherLinks() {
  return (
    <div
      className="flex flex-wrap text-xs text-muted-foreground gap-4 whitespace-nowrap"
      aria-label="Other links"
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
