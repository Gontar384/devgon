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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between bg-background shadow-md animate-fadeIn">
      <Link href="/frontend/public" className="ml-5 select-none flex-shrink-0">
        <Image
          src="/logo/logo_caption_color.svg"
          alt="Logo devgon"
          width={80}
          height={60}
          priority
        />
      </Link>
      <div className="hidden sm:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink href="/frontend/public">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/products">Produkty</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/frontend/public">
                O nas
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="hidden sm:flex gap-2">
        <Button variant="outline">Log in</Button>
        <Button>Sign up</Button>
      </div>
      <HamburgerButton />
    </nav>
  );
}
