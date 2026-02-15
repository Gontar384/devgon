'use client';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { useMobileBarStore } from '@/store/mobileBarStore';

export default function NavbarClient() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef<number>(0);
  const ticking = useRef(false);
  const { openedBar, programmaticScroll } = useMobileBarStore();
  const openedBarRef = useRef(openedBar);
  const programmaticScrollRef = useRef(programmaticScroll);

  useEffect(() => {
    openedBarRef.current = openedBar;
    programmaticScrollRef.current = programmaticScroll;
  }, [openedBar, programmaticScroll]);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      if (openedBarRef.current || programmaticScrollRef.current) return;

      const currentY = window.scrollY || 0;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY.current;
          const THRESHOLD = 3;
          const MIN_SCROLL_TO_HIDE = 30;

          if (Math.abs(delta) >= THRESHOLD) {
            if (delta > 0 && currentY > MIN_SCROLL_TO_HIDE) {
              setHidden(true);
            } else if (delta < 0) {
              setHidden(false);
            }
          }

          lastY.current = currentY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-45 transition-transform duration-400 will-change-transform ${
        hidden && !openedBar ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <Navbar />
    </div>
  );
}
