'use client';
import React, { useEffect } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LoginButtonWrapper } from '@/app/layout-ui/navbar/parts/LoginButtonWrapper';
import { DropdownInterface } from '@/app/layout-ui/navbar/types';
import menuData from '@/app/layout-ui/navbar/menuData.json';
import { MobileDropdown } from '@/app/layout-ui/navbar/mobile-bar/MobileDropdown';
import { MobileDropdownOption } from '@/app/layout-ui/navbar/mobile-bar/MobileDropdownOption';

export default function MobileBar() {
  const { open, close } = useMobileBarStore();
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, pathname]);

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

  const typedMenuData: DropdownInterface[] = menuData;

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          key="sidebar"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-0 top-16 z-45 bg-background/90 p-8 md:hidden flex flex-col items-center overflow-y-auto select-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Menu mobilne
          </h2>
          <div className="md:hidden flex flex-col justify-center gap-6 mt-8">
            {typedMenuData.map((dropdown) => (
              <MobileDropdown
                title={dropdown.title}
                hRef={dropdown.href}
                key={dropdown.title}
              >
                {dropdown.option.map((option) => (
                  <MobileDropdownOption
                    title={option.title}
                    href={option.href}
                    imageSrc={option.imageSrc}
                    imageW={option.imageW}
                    imageH={option.imageH}
                    key={option.title}
                  />
                ))}
              </MobileDropdown>
            ))}
          </div>
          <LoginButtonWrapper isMobileBar={true} />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
