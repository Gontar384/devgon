import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-1 bg-background shadow-md">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo devgon"
          width={75}
          height={69}
          priority
        />
      </Link>

      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/products">Produkty</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">O nas</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="hidden md:flex gap-2">
        <Button variant="outline">Log in</Button>
        <Button>Sign up</Button>
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-2">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <DialogTitle>
              <VisuallyHidden>Menu mobilne</VisuallyHidden>
            </DialogTitle>
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink href="/">Home</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/products">
                    Produkty
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/">O nas</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="mt-6 flex flex-col gap-2">
              <Button variant="outline">Log in</Button>
              <Button>Sign up</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
