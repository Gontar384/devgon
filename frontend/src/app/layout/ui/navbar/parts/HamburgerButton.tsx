'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, Hamburger } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useDeviceStore } from '@/store/deviceStore';
import { useHoverWithTouch } from '../../../util/useHoverWithTouch';

export function HamburgerButton() {
  const { toggleBar, openedBar } = useMobileBarStore();
  const detectDevice = useDeviceStore((state) => state.detectDevice);
  const [blockInitAnimation, setBlockInitAnimation] = useState(true);
  const { hovered, handlers } = useHoverWithTouch();

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
    <button
      className={`flex items-center justify-center h-12 px-2.5 mr-3 md:hidden cursor-pointer rounded-md ${hovered ? 'bg-accent' : ''}`}
      aria-label="Otwórz menu nawigacji mobilnej"
      onClick={toggleBar}
      {...handlers}
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
            <Hamburger className="!w-10 !h-10" aria-hidden="true" />
          </motion.div>
        ) : (
          <motion.div
            key="circlex"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -180 }}
            transition={{ duration: 0.2 }}
          >
            <CircleX className="!w-10 !h-10" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
