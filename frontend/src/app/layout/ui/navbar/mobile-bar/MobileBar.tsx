'use client';
import React, { useEffect, useRef } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NavbarProps } from '@/app/layout/util/types';
import { MobileDropdown } from '@/app/layout/ui/navbar/mobile-bar/MobileDropdown';
import { MobileDropdownOption } from '@/app/layout/ui/navbar/mobile-bar/MobileDropdownOption';
import { AuthButton } from '@/app/layout/ui/navbar/auth-button/AuthButton';
import { dropdownData } from '@/app/layout/ui/navbar/main-menu-bar/dropdownData';

export default function MobileBar({ authUser }: NavbarProps) {
  const { openedBar, closeBar, setProgrammaticScroll } = useMobileBarStore();
  const pathname = usePathname();
  const scrollYRef = useRef(0);
  const openedBarRef = useRef(openedBar);
  openedBarRef.current = openedBar;

  useEffect(() => {
    if (openedBar) {
      closeBar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeBar, pathname]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (openedBar) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
    } else {
      setProgrammaticScroll(true);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
      timeout = setTimeout(() => setProgrammaticScroll(false), 50);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedBar]);

  useEffect(() => {
    const checkWidth = () => {
      requestAnimationFrame(() => {
        const isDesktop = window.innerWidth >= 768;
        if (openedBarRef.current && isDesktop) {
          closeBar();
        }
      });
    };
    checkWidth();

    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {openedBar && (
        <motion.nav
          key="sidebar"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-0 top-16 z-40 bg-background p-8 md:hidden flex flex-col items-center overflow-y-auto select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
        >
          <div className="md:hidden flex flex-col justify-center gap-6 mt-8">
            {dropdownData.map((dropdown) => (
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
