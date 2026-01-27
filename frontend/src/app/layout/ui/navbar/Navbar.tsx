import { HamburgerButton } from '@/app/layout/ui/navbar/parts/HamburgerButton';
import React from 'react';
import { SiteLogo } from '@/app/layout/ui/navbar/parts/SiteLogo';
import { MainMenuBar } from '@/app/layout/ui/navbar/main-menu-bar/MainMenuBar';
import { AuthButton } from '@/app/layout/ui/navbar/auth-button/AuthButton';

export default function Navbar() {
  return (
    <nav
      className="w-full h-16 flex items-center justify-between bg-background shadow-md"
      aria-label="Główna nawigacja"
    >
      <SiteLogo />
      <MainMenuBar />
      <AuthButton isMobileBar={false} />
      <HamburgerButton />
    </nav>
  );
}
