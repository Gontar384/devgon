import { HamburgerButton } from '@/app/layout-ui/navbar/parts/HamburgerButton';
import React from 'react';
import { SiteLogo } from '@/app/layout-ui/navbar/parts/SiteLogo';
import { MenuBar } from '@/app/layout-ui/navbar/menu-bar/MenuBar';
import { LoginButtonWrapper } from './parts/LoginButtonWrapper';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-background/90 shadow-md"
      aria-label="Główna nawigacja"
    >
      <SiteLogo />
      <MenuBar />
      <LoginButtonWrapper isMobileBar={false} />
      <HamburgerButton aria-label="Otwórz menu nawigacji mobilnej" />
    </nav>
  );
}
