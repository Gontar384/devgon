import { HamburgerButton } from '@/components/layout/navbar/HamburgerButton';
import React from 'react';
import { LoginButton } from '@/components/layout/navbar/LoginButton';
import { SiteLogo } from '@/components/layout/navbar/SiteLogo';
import { MainMenu } from '@/components/layout/navbar/MainMenu';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-background/90 shadow-md"
      aria-label="Główna nawigacja"
    >
      <p className="sr-only">devgon logo</p>
      <SiteLogo />
      <MainMenu />
      <div className="hidden md:flex mr-4" aria-label="Akcje użytkownika">
        <button className="sr-only">
          Zaloguj się za pomocą Google, aby odblokować pełne możliwości naszej
          strony
        </button>
        <LoginButton isMobileBar={false} />
      </div>
      <HamburgerButton aria-label="Otwórz menu nawigacji mobilnej" />
    </nav>
  );
}
