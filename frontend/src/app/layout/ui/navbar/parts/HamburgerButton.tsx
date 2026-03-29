'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, Hamburger } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useDeviceStore } from '@/store/deviceStore';

export function HamburgerButton() {
  const { toggleBar, openedBar } = useMobileBarStore();
  const detectDevice = useDeviceStore((state) => state.detectDevice);
  const [blockInitAnimation, setBlockInitAnimation] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setBlockInitAnimation(false), 50);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    detectDevice();
  }, [detectDevice]);

  return (
    <Button
      variant="ghost"
      className={`mr-3 h-12 p-3 md:hidden cursor-pointer ${pressed ? 'bg-accent' : ''}`}
      aria-label="Otwórz menu nawigacji mobilnej"
      onClick={toggleBar}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onTouchMove={() => setPressed(false)}
    >
      <AnimatePresence mode="wait">
        {!openedBar ? (
          <motion.div
            key="hamburger"
            initial={blockInitAnimation ? false : { opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Hamburger className="!w-10 !h-10" />
          </motion.div>
        ) : (
          <motion.div
            key="circlex"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -180 }}
            transition={{ duration: 0.2 }}
          >
            <CircleX className="!w-10 !h-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
