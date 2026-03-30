'use client';
import { smallMenu } from '@/app/layout/ui/footer/linksData';
import React from 'react';
import { useNavigation } from '@/app/layout/util/useNavigation';
import { NavLink } from '@/app/layout/util/NavLink';

export function SmallMenu() {
  const { navigateToTop } = useNavigation();

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <div className="font-semibold">Nawigacja</div>
      <div
        className="flex flex-col justify-center gap-1 whitespace-nowrap"
        aria-label="Nawigacja"
      >
        {smallMenu.map((link) => (
          <NavLink
            key={link.title}
            href={link.href}
            onNavigate={link.href === '/' ? navigateToTop : undefined}
            className="cursor-pointer hover:underline active:underline"
          >
            {link.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
