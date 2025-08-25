'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useSidebarStore } from '../../../../store/sidebarStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileSidebar() {
  const { open, close } = useSidebarStore();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          key="sidebar"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-background p-8 sm:hidden flex flex-col justify-center items-center"
        >
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-6 text-lg">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" onClick={close}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/products" onClick={close}>
                  Produkty
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" onClick={close}>
                  O nas
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="mt-auto flex flex-col gap-3">
            <Button variant="outline" onClick={close}>
              Log in
            </Button>
            <Button onClick={close}>Sign up</Button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
