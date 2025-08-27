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

export default function MobileBar() {
  const { open } = useSidebarStore();

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
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
          className="fixed inset-0 top-16 z-45 bg-background/90 p-8 sm:hidden flex flex-col justify-center items-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Menu mobilne
          </h2>
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  aria-current="page"
                  className="text-base hover:scale-105 active:scale-105"
                >
                  O nas
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/products"
                  className="text-base hover:scale-105 active:scale-105"
                >
                  Oferta
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="text-base hover:scale-105 active:scale-105"
                >
                  Kontakt
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div
            className="mt-auto flex flex-col gap-3"
            aria-label="Akcje użytkownika"
          >
            <Button className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none">
              Kontakt
            </Button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
