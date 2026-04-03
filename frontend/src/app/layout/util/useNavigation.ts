'use client';
import React, { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMobileBarStore } from '@/store/mobileBarStore';

const NAVBAR_HEIGHT = 64;

export const navigationSuppressRef = { current: false };

function performScroll(targetY: number, onDone: () => void) {
  const bodyFixed = document.body.style.position === 'fixed';

  if (bodyFixed) {
    requestAnimationFrame(() => performScroll(targetY, onDone));
    return;
  }

  if (Math.abs(window.scrollY - targetY) < 2) {
    onDone();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(safetyNet);
    clearTimeout(idleTimeout);
    window.removeEventListener('scroll', onScrollActivity);
    window.removeEventListener('scrollend', onScrollEnd);
    onDone();
  };

  const onScrollEnd = () => finish();
  window.addEventListener('scrollend', onScrollEnd, { once: true });

  let idleTimeout: ReturnType<typeof setTimeout>;
  const onScrollActivity = () => {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(finish, 150);
  };
  window.addEventListener('scroll', onScrollActivity, { passive: true });

  const safetyNet = setTimeout(finish, 3000);

  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

function scrollToSection(sectionId: string, onDone: () => void) {
  const el = document.getElementById(sectionId);
  if (!el) {
    onDone();
    return;
  }
  const targetY =
    el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  performScroll(targetY, onDone);
}

export function useNavigation() {
  const { closeBar, setIsNavigating } = useMobileBarStore();
  const router = useRouter();
  const pathname = usePathname();

  const navigateToTop = useCallback(() => {
    closeBar();

    router.push('/', { scroll: false });
    navigationSuppressRef.current = true;
    setIsNavigating(true);
    performScroll(0, () => {
      navigationSuppressRef.current = false;
      setIsNavigating(false);
    });
  }, [closeBar, setIsNavigating, router]);

  const navigateTo = useCallback(
    (href: string) => {
      closeBar();

      const [rawPath, sectionId] = href.split('#');
      const targetPath = rawPath || pathname;

      const isSamePage =
        pathname === targetPath || (targetPath === '/' && pathname === '/');

      if (sectionId && isSamePage) {
        navigationSuppressRef.current = true;
        setIsNavigating(true);

        router.push(href, { scroll: false });

        setTimeout(() => {
          scrollToSection(sectionId, () => {
            navigationSuppressRef.current = false;
            setIsNavigating(false);
          });
        }, 50);
        return;
      }

      navigationSuppressRef.current = true;
      setIsNavigating(true);

      router.push(href, { scroll: false });

      if (!sectionId) {
        setTimeout(() => {
          performScroll(0, () => {
            navigationSuppressRef.current = false;
            setIsNavigating(false);
          });
        }, 100);
      }
    },
    [closeBar, pathname, router, setIsNavigating],
  );

  const getLinkHandler = useCallback(
    (href: string, onNavigate?: () => void) => {
      return (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }

        e.preventDefault();
        if (onNavigate) {
          onNavigate();
        } else {
          navigateTo(href);
        }
      };
    },
    [navigateTo],
  );

  return { navigateTo, navigateToTop, getLinkHandler };
}

export function useHashScrollOnMount() {
  const { setIsNavigating } = useMobileBarStore();
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    navigationSuppressRef.current = true;
    setIsNavigating(true);

    let attempts = 0;
    const maxAttempts = 100;

    const checkExist = setInterval(() => {
      const element = document.getElementById(hash);
      attempts++;

      if (element) {
        clearInterval(checkExist);
        setTimeout(() => {
          scrollToSection(hash, () => {
            navigationSuppressRef.current = false;
            setIsNavigating(false);
          });
        }, 100);
      }

      if (attempts >= maxAttempts) {
        clearInterval(checkExist);
        navigationSuppressRef.current = false;
        setIsNavigating(false);
      }
    }, 50);

    return () => clearInterval(checkExist);
  }, [setIsNavigating, pathname]);
}
