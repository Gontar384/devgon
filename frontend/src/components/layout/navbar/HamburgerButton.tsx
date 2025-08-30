'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, Hamburger } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { useMobileBarStore } from '../../../../store/mobileBarStore';
import { useDeviceStore } from '../../../../store/deviceStore';

export const HamburgerButton = () => {
  const { toggle, open } = useMobileBarStore();

  const detectDevice = useDeviceStore((state) => state.detectDevice);
  useEffect(() => {
    detectDevice();
  }, [detectDevice]);

  return (
    <Button
      variant="ghost"
      className="mr-3 h-12 p-3 sm:hidden cursor-pointer active:bg-accent"
      onClick={toggle}
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
            <Hamburger className="!w-10 !h-10" />
          </motion.div>
        ) : (
          <motion.div
            key="circlex"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <CircleX className="!w-10 !h-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
