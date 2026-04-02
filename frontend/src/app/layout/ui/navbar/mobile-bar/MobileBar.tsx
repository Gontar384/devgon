'use client';
import React, { useEffect, useRef } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MobileDropdown } from '@/app/layout/ui/navbar/mobile-bar/MobileDropdown';
import { MobileDropdownOption } from '@/app/layout/ui/navbar/mobile-bar/MobileDropdownOption';
import { AuthButton } from '@/app/layout/ui/navbar/auth-button/AuthButton';
import { dropdownData } from '@/app/layout/util/dropdownData';
import { suppressScrollRef } from '@/app/layout/util/scrollControl';

export default function MobileBar() {
  const { openedBar, closeBar, setIsNavigating } = useMobileBarStore();
  const pathname = usePathname();
  const scrollYRef = useRef(0);
  const openedBarRef = useRef(openedBar);
  const isMountedRef = useRef(false);
  openedBarRef.current = openedBar;

  useEffect(() => {
    if (openedBar) closeBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (!openedBar) return;
    }

    if (openedBar) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
    } else {
      suppressScrollRef.current = true;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      document.documentElement.style.scrollBehavior = 'auto';

      window.scrollTo(0, scrollYRef.current);

      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = '';

        requestAnimationFrame(() => {
          suppressScrollRef.current = false;
        });
      });

      const navigatingToSection = useMobileBarStore.getState().isNavigating;
      if (!navigatingToSection) {
        setIsNavigating(true);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsNavigating(false);
          });
        });
      }
    }
  }, [openedBar, setIsNavigating]);

  useEffect(() => {
    const checkWidth = () => {
      requestAnimationFrame(() => {
        const isDesktop = window.innerWidth >= 768;
        if (openedBarRef.current && isDesktop) closeBar();
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
          className="fixed inset-0 top-16 z-40 bg-background p-8 md:hidden flex flex-col items-center overflow-y-auto overflow-x-hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
          tabIndex={-1}
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <div className="md:hidden flex flex-col justify-center gap-6 mt-8">
            {dropdownData.map((dropdown) => (
              <MobileDropdown
                title={dropdown.title}
                href={dropdown.href}
                key={dropdown.title}
              >
                {dropdown.option?.map((option) => (
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
          <AuthButton isMobileBar={true} />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
