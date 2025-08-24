'use client';
import { Button } from '@/components/ui/button';
import { Hamburger, CircleX } from 'lucide-react';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const MobileSidebar = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Button
      variant="ghost"
      className="p-2 sm:hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="hamburger"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Hamburger className="!w-8 !h-8" />
          </motion.div>
        ) : (
          <motion.div
            key="circlex"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <CircleX className="!w-8 !h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
