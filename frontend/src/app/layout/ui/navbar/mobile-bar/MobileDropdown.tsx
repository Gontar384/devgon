'use client';
import React, { useState } from 'react';
import { DropdownWrapperProps } from '@/app/layout/layout-types';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleChevronUp } from 'lucide-react';
import { useHoverWithTouch } from '@/app/layout/util/useHoverWithTouch';
import { NavLink } from '@/app/layout/util/NavLink';

export function MobileDropdown({
  title,
  href,
  children,
}: DropdownWrapperProps) {
  const [accordionActive, setAccordionActive] = useState(false);
  const hasChildren = React.Children.count(children) > 0;
  const { hovered, handlers } = useHoverWithTouch();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <NavLink
          href={href}
          className="rounded-xl flex items-center justify-center border border-foreground/40 w-72 px-4 h-12 text-xl font-semibold transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md hover:bg-accent active:scale-[0.98] active:bg-accent"
        >
          {title}
        </NavLink>
        {hasChildren && (
          <button
            className={`flex items-center justify-center h-12 p-1.5 cursor-pointer rounded-md ${hovered ? 'bg-accent' : ''}`}
            aria-expanded={accordionActive}
            aria-controls={`submenu-${title.replace(/\s/g, '-')}`}
            onClick={() => setAccordionActive((prev) => !prev)}
            {...handlers}
          >
            <motion.div
              animate={{ rotate: accordionActive ? 180 : 0 }}
              initial={false}
              transition={{ duration: 0.2 }}
            >
              <CircleChevronUp className="!w-10 !h-10" />
            </motion.div>
          </button>
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
