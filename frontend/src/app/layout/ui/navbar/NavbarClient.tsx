'use client';
import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useMobileBarStore } from '@/store/mobileBarStore';

export default function NavbarClient() {
  const hiddenRef = useRef(false);
  const lastY = useRef<number>(0);
  const ticking = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openedBar, isNavigating } = useMobileBarStore();
  const suppressRef = useRef(false);
  const hasUserScrolled = useRef(false);

  const applyVisibility = (hide: boolean) => {
    hiddenRef.current = hide;
    if (containerRef.current) {
      containerRef.current.style.transform = hide
        ? 'translateY(-100%)'
        : 'translateY(0)';
    }
  };

  useEffect(() => {
    suppressRef.current = openedBar || isNavigating;

    if (!isNavigating && !openedBar) {
      lastY.current = window.scrollY;
      applyVisibility(false);
    }
  }, [openedBar, isNavigating]);

  useEffect(() => {
    const markUserScroll = () => {
      hasUserScrolled.current = true;
    };

    window.addEventListener('wheel', markUserScroll, { passive: true });
    window.addEventListener('touchmove', markUserScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', markUserScroll);
      window.removeEventListener('touchmove', markUserScroll);
    };
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (!hasUserScrolled.current) {
        lastY.current = window.scrollY;
        return;
      }

      if (suppressRef.current) return;

      const currentY = window.scrollY;
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        const delta = currentY - lastY.current;
        const THRESHOLD = 3;
        const MIN_SCROLL_TO_HIDE = 30;

        if (Math.abs(delta) >= THRESHOLD) {
          if (delta > 0 && currentY > MIN_SCROLL_TO_HIDE) {
            applyVisibility(true);
          } else if (delta < 0) {
            applyVisibility(false);
          }
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-45 transition-transform duration-400 will-change-transform"
    >
      <Navbar />
    </div>
  );
}
