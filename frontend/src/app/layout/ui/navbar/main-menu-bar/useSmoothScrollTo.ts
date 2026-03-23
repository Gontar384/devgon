import { useMobileBarStore } from '@/store/mobileBarStore';

export function useSmoothScrollTo() {
  const setProgrammaticScroll = useMobileBarStore(
    (s) => s.setProgrammaticScroll,
  );
  const setScrollingToAnchor = useMobileBarStore((s) => s.setScrollingToAnchor);

  return (id: string) => {
    setProgrammaticScroll(true);
    const el = document.getElementById(id);
    setTimeout(() => {
      el?.scrollIntoView({ behavior: 'smooth' });
      window.addEventListener(
        'scrollend',
        () => {
          setProgrammaticScroll(false);
          setScrollingToAnchor(false);
        },
        { once: true },
      );
    }, 100);
  };
}
