import { HamburgerButton } from '@/app/layout-ui/navbar/parts/HamburgerButton';
import React from 'react';
import { SiteLogo } from '@/app/layout-ui/navbar/parts/SiteLogo';
import { MainMenuBar } from '@/app/layout-ui/navbar/main-menu-bar/MainMenuBar';
import { LoginButton } from '@/app/layout-ui/navbar/parts/LoginButton';
import { NavbarData } from '@/app/layout-ui/types';

export default function Navbar({ authUser }: NavbarData) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-background/90 shadow-md"
      aria-label="Główna nawigacja"
    >
      <SiteLogo />
      <MainMenuBar />
      <LoginButton isMobileBar={false} authUser={authUser} />
      <HamburgerButton />
    </nav>
  );
}
