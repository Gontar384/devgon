'use client';
import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { navigationSuppressRef } from '@/app/layout/util/useNavigation';
import { suppressScrollRef } from '@/app/layout/util/scrollControl';

export default function NavbarClient() {
  const hiddenRef = useRef(false);
  const lastY = useRef<number>(0);
  const ticking = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasUserScrolled = useRef(false);
  const isTransitioning = useRef(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openedBar, isNavigating } = useMobileBarStore();
  const isResizing = useRef(false);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyVisibility = (hide: boolean) => {
    if (hiddenRef.current === hide) return;
    hiddenRef.current = hide;
    if (containerRef.current) {
      containerRef.current.style.transform = hide
        ? 'translateY(-100%)'
        : 'translateY(0)';
    }
    if (hide) {
      window.dispatchEvent(new CustomEvent('navbar:hide'));
    }
  };

  useEffect(() => {
    isTransitioning.current = true;
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);

    transitionTimeout.current = setTimeout(() => {
      isTransitioning.current = false;

      if (!openedBar) {
        lastY.current = window.scrollY;
        applyVisibility(false);
        hiddenRef.current = false;
      }
    }, 450);

    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, [openedBar]);

  useEffect(() => {
    if (!isNavigating && !openedBar) {
      lastY.current = window.scrollY;
      applyVisibility(false);
      hiddenRef.current = false;
    }
  }, [isNavigating, openedBar]);

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
      if (
        !hasUserScrolled.current ||
        navigationSuppressRef.current ||
        openedBar ||
        suppressScrollRef.current ||
        isTransitioning.current ||
        isResizing.current
      ) {
        lastY.current = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      if (currentY < 0) return;

      if (ticking.current) {
        lastY.current = window.scrollY;
        return;
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => {
      isResizing.current = true;
      lastY.current = window.scrollY;
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        isResizing.current = false;
        lastY.current = window.scrollY;
      }, 200);
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden={hiddenRef.current}
      className="fixed top-0 left-0 right-0 z-45 transition-transform duration-400 will-change-transform"
    >
      <Navbar />
    </div>
  );
}
