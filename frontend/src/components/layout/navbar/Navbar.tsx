import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import Link from 'next/link';
import { HamburgerButton } from '@/components/layout/navbar/HamburgerButton';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-background/90 shadow-md"
      aria-label="Główna nawigacja"
    >
      <Link
        href="/"
        className="ml-5 select-none flex-shrink-0 animate-fadeIn"
        aria-label="Strona główna"
      >
        <Image
          src="/logo/logo_caption_black.svg"
          alt=""
          width={80}
          height={60}
          priority
        />
      </Link>
      <div className="hidden sm:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4 ">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                aria-current="page"
                className="text-base"
              >
                O nas
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/products" className="text-base">
                Oferta
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-base">
                Kontakt
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="hidden sm:flex mr-5" aria-label="Akcje użytkownika">
        <Button className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none">
          Zaloguj się
        </Button>
      </div>
      <HamburgerButton aria-label="Otwórz menu nawigacji mobilnej" />
    </nav>
  );
}
