'use client';
import React, { useState } from 'react';
import { DropdownWrapperProps } from '@/app/layout/layout-types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleChevronUp } from 'lucide-react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useSmoothScrollTo } from '@/app/layout/ui/navbar/main-menu-bar/useSmoothScrollTo';

export function MobileDropdown({
  title,
  href,
  children,
}: DropdownWrapperProps) {
  const [accordionActive, setAccordionActive] = useState<boolean>(false);
  const hasChildren = React.Children.count(children) > 0;

  const handleAccordionToggle = () => {
    setAccordionActive((prev) => !prev);
  };

  const { closeBar, setScrollingToAnchor } = useMobileBarStore();
  const scrollTo = useSmoothScrollTo();
  const isAnchor = href.startsWith('/#');

  const handleClick = () => {
    closeBar();
    if (isAnchor) {
      setScrollingToAnchor(true);
      scrollTo(href.replace('/#', ''));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <Link
          href={href}
          onClick={handleClick}
          className="rounded-xl flex items-center justify-center border border-foreground/40 w-72 px-4 h-12 text-xl font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md hover:bg-accent active:scale-[0.98] active:bg-accent"
        >
          {title}
        </Link>
        {hasChildren && (
          <Button
            variant="ghost"
            onClick={handleAccordionToggle}
            className="cursor-pointer h-12 !p-1.5 active:bg-accent"
            aria-expanded={accordionActive}
            aria-controls={`submenu-${title.replace(/\s/g, '-')}`}
          >
            <motion.div
              animate={{ rotate: accordionActive ? 180 : 0 }}
              initial={false}
              transition={{ duration: 0.2 }}
            >
              <CircleChevronUp className="!w-10 !h-10" />
            </motion.div>
          </Button>
        )}
      </div>
      {hasChildren && (
        <AnimatePresence initial={false}>
          {accordionActive && (
            <motion.div
              id={`submenu-${title.replace(/\s/g, '-')}`}
              key="submenu-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-2 pl-4 overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
