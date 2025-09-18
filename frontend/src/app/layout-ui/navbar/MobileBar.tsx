'use client';
import React, { useEffect } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { DropdownData, NavbarData } from '@/app/layout-ui/types';
import layoutData from '@/app/layout-ui/layoutData.json';
import { MobileDropdown } from '@/app/layout-ui/navbar/mobile-bar/MobileDropdown';
import { MobileDropdownOption } from '@/app/layout-ui/navbar/mobile-bar/MobileDropdownOption';
import { AuthButton } from '@/app/layout-ui/navbar/auth-button/AuthButton';

export default function MobileBar({ authUser }: NavbarData) {
  const { open, close } = useMobileBarStore();
  const pathname = usePathname();
  const typedMenuData: DropdownData[] = layoutData.menu.items;

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
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
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
          className="fixed inset-0 top-16 z-40 bg-background/90 p-8 md:hidden flex flex-col items-center overflow-y-auto select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
        >
          <div className="md:hidden flex flex-col justify-center gap-6 mt-8">
            {typedMenuData.map((dropdown) => (
              <MobileDropdown
                title={dropdown.title}
                href={dropdown.href}
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
          <AuthButton isMobileBar={true} authUser={authUser} />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
