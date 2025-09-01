'use client';
import React, { useEffect, useState } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginButton } from '@/components/layout/navbar/LoginButton';
import Link from 'next/link';
import { CircleChevronUp } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function MobileBar() {
  const { open, close } = useMobileBarStore();
  const pathname = usePathname();
  const [accordionActive, setAccordionActive] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

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

  const handleAccordionToggle = (index: number) => {
    setAccordionActive((prev) =>
      prev.map((val, i) => (i === index ? !val : val)),
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          key="sidebar"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-0 top-16 z-45 bg-background/90 p-8 sm:hidden flex flex-col items-center overflow-y-auto select-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Menu mobilne
          </h2>
          <div className="sm:hidden flex flex-col justify-center gap-6 mt-8">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <Link
                  href="/"
                  className="rounded-xl flex items-center justify-between border border-foreground/40 w-72 px-4 h-12 text-lg font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent/50 active:bg-accent/50"
                >
                  O nas
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => handleAccordionToggle(0)}
                  className="cursor-pointer h-12 !p-1.5 active:bg-accent"
                >
                  <motion.div
                    animate={{ rotate: accordionActive[0] ? 180 : 0 }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                  >
                    <CircleChevronUp className="!w-10 !h-10" />
                  </motion.div>
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {accordionActive[0] && (
                  <motion.div
                    key="submenu-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex flex-col gap-2 pl-4 overflow-hidden"
                  >
                    <Link
                      href="/"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Czym się zajmujemy?
                      <Image
                        src="/svg/btn-what-we-do.svg"
                        alt="Czym się zajmujemy?"
                        width={34}
                        height={33}
                        priority
                      />
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Nasz zespół
                      <Image
                        src="/svg/btn-our-team.svg"
                        alt="Nasz zespół"
                        width={60}
                        height={31}
                        priority
                      />
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Aktualności
                      <Image
                        src="/svg/btn-news.svg"
                        alt="Aktualności"
                        width={39}
                        height={34}
                        priority
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                <Link
                  href="/products"
                  className="rounded-xl flex items-center justify-between border border-foreground/40 w-72 px-4 h-12 text-lg font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent/50 active:bg-accent/50"
                >
                  Oferta
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => handleAccordionToggle(1)}
                  className="cursor-pointer h-12 !p-1.5 active:bg-accent"
                >
                  <motion.div
                    animate={{ rotate: accordionActive[1] ? 180 : 0 }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                  >
                    <CircleChevronUp className="!w-10 !h-10" />
                  </motion.div>
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {accordionActive[1] && (
                  <motion.div
                    key="submenu-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex flex-col gap-2 pl-4 overflow-hidden"
                  >
                    <Link
                      href="/products"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Świadczone usługi
                      <Image
                        src="/svg/btn-our-offer.svg"
                        alt="Świadczone usługi"
                        width={40}
                        height={42}
                        priority
                      />
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Dlaczego warto?
                      <Image
                        src="/svg/btn-why-its-worth.svg"
                        alt="Dlaczego warto?"
                        width={42}
                        height={33}
                        priority
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                <Link
                  href="/"
                  className="rounded-xl flex items-center justify-between border border-foreground/40 w-72 px-4 h-12 text-lg font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent/50 active:bg-accent/50"
                >
                  Kontakt
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => handleAccordionToggle(2)}
                  className="cursor-pointer h-12 !p-1.5 active:bg-accent"
                >
                  <motion.div
                    animate={{ rotate: accordionActive[2] ? 180 : 0 }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                  >
                    <CircleChevronUp className="!w-10 !h-10" />
                  </motion.div>
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {accordionActive[2] && (
                  <motion.div
                    key="submenu-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex flex-col gap-2 pl-4 overflow-hidden"
                  >
                    <Link
                      href="/"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Skontaktuj się
                      <Image
                        src="/svg/btn-contact-us.svg"
                        alt="Skontaktuj się"
                        width={47}
                        height={30}
                        priority
                      />
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-sm transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
                    >
                      Gdzie nas znaleźć?
                      <Image
                        src="/svg/btn-where-to-find-us.svg"
                        alt="Gdzie nas znaleźć?"
                        width={44}
                        height={36}
                        priority
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <LoginButton isMobileBar={true} />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
