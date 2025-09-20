import { HamburgerButton } from '@/app/layout-ui/navbar/parts/HamburgerButton';
import React from 'react';
import { SiteLogo } from '@/app/layout-ui/navbar/parts/SiteLogo';
import { MainMenuBar } from '@/app/layout-ui/navbar/main-menu-bar/MainMenuBar';
import { AuthButton } from '@/app/layout-ui/navbar/auth-button/AuthButton';
import { NavbarData } from '@/app/layout-ui/types';

export default function Navbar({ authUser }: NavbarData) {
  return (
    <nav
      className="w-full h-16 flex items-center justify-between bg-background shadow-md"
      aria-label="Główna nawigacja"
    >
      <SiteLogo />
      <MainMenuBar />
      <AuthButton isMobileBar={false} authUser={authUser} />
      <HamburgerButton />
    </nav>
  );
}
