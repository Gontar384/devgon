import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { Logo } from '@/components/layout/Logo';

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-1 bg-background shadow-md animate-fadeIn">
      <Logo />
      <div className="hidden sm:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
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
      <MobileSidebar />
    </nav>
  );
}
