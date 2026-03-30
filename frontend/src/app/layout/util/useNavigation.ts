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

    if (pathname !== '/') {
      router.push('/');
      return;
    }

    router.push('/', { scroll: false });
    navigationSuppressRef.current = true;
    setIsNavigating(true);
    performScroll(0, () => {
      navigationSuppressRef.current = false;
      setIsNavigating(false);
    });
  }, [closeBar, setIsNavigating, pathname, router]);

  const navigateTo = useCallback(
    (href: string) => {
      closeBar();

      const isAnchor = href.startsWith('/#');

      if (!isAnchor) {
        navigationSuppressRef.current = true;
        setIsNavigating(true);

        router.push(href);

        setTimeout(() => {
          performScroll(0, () => {
            navigationSuppressRef.current = false;
            setIsNavigating(false);
          });
        }, 50);
        return;
      }

      const sectionId = href.slice(2);

      if (pathname !== '/') {
        navigationSuppressRef.current = true;
        setIsNavigating(true);
        router.push(href);
        setTimeout(() => {
          navigationSuppressRef.current = false;
          setIsNavigating(false);
        }, 1500);
        return;
      }

      router.push(href, { scroll: false });
      navigationSuppressRef.current = true;
      setIsNavigating(true);

      setTimeout(() => {
        scrollToSection(sectionId, () => {
          navigationSuppressRef.current = false;
          setIsNavigating(false);
        });
      }, 50);
    },
    [closeBar, setIsNavigating, pathname, router],
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const timeout = setTimeout(() => {
      navigationSuppressRef.current = true;
      setIsNavigating(true);
      scrollToSection(hash, () => {
        navigationSuppressRef.current = false;
        setIsNavigating(false);
      });
    }, 100);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
