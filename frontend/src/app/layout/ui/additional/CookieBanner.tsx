'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent || consent === 'false') {
      const timeout = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 fixed bottom-4 left-1/2 transform -translate-x-1/2
                     max-w-[1000px] w-[90%] bg-secondary text-white py-4 px-4 md:px-8 rounded-xl shadow-lg z-50 select-none"
        >
          <span className="text-center md:text-left">
            This site uses cookies to work correctly and to give you a better
            experience.
          </span>
          <button
            onClick={acceptCookies}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
