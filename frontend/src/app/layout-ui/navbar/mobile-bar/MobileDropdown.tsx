import React, { useState } from 'react';
import { DropdownWrapperProps } from '@/app/layout-ui/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleChevronUp } from 'lucide-react';

export function MobileDropdown({
  title,
  href,
  children,
}: DropdownWrapperProps) {
  const [accordionActive, setAccordionActive] = useState<boolean>(false);

  const handleAccordionToggle = () => {
    setAccordionActive((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <Link
          href={href}
          className="rounded-xl flex items-center justify-between border border-foreground/40 w-72 px-4 h-12 text-lg font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent/50 active:bg-accent/50"
        >
          {title}
        </Link>
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
      </div>
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
    </div>
  );
}
