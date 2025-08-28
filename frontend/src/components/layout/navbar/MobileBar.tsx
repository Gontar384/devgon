'use client';
import React, { useEffect } from 'react';
import { useMobileBarStore } from '../../../../store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginButton } from '@/components/layout/navbar/LoginButton';
import Link from 'next/link';
import { CircleChevronRight } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          key="sidebar"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-0 top-16 z-45 bg-background/90 p-8 sm:hidden flex flex-col items-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Menu mobilne
          </h2>
          <div className="sm:hidden flex flex-col justify-center gap-6 p-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-xl flex items-center justify-between border border-foreground/40 px-4 h-12 text-xl font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
              >
                O nas
                <CircleChevronRight className="w-8 h-8" />
              </Link>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Co robimy
                  <Image
                    src="/svg/what-we-do.svg"
                    alt="Co robimy"
                    width={35}
                    height={34}
                  />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Nasz zespół
                  <Image
                    src="/svg/our-team.svg"
                    alt="Nasz zespół"
                    width={67}
                    height={37}
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="rounded-xl flex items-center justify-between border border-foreground/40 px-4 h-12 text-xl font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
              >
                Oferta
                <CircleChevronRight className="w-8 h-8" />
              </Link>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/products"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Usługi
                  <Image
                    src="/svg/offer.svg"
                    alt="Usługi"
                    width={42}
                    height={45}
                  />
                </Link>
                <Link
                  href="/products"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Czemu warto
                  <Image
                    src="/svg/why-its-worth.svg"
                    alt="Czemu warto"
                    width={46}
                    height={36}
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-xl flex items-center justify-between border border-foreground/40 px-4 h-12 text-xl font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
              >
                Kontakt
                <CircleChevronRight className="w-8 h-8" />
              </Link>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Odezwij się
                  <Image
                    src="/svg/call-us.svg"
                    alt="Odezwij się"
                    width={40}
                    height={40}
                  />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 px-4 h-14 text-lg transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98]"
                >
                  Gdzie znaleźć
                  <Image
                    src="/svg/where-to-find.svg"
                    alt="Gdzie znaleźć"
                    width={33}
                    height={42}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div
            className="flex flex-col gap-3 mt-8"
            aria-label="Akcje użytkownika"
          >
            <button className="sr-only">
              Zaloguj się za pomocą Google, aby odblokować pełne możliwości
              naszej strony
            </button>
            <LoginButton mobileScreen={true} />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
