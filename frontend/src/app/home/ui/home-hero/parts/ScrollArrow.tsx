'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollArrow() {
  const handleClick = () => {
    window.scrollTo({ top: window.innerHeight + 64, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to the next section"
      className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary active:text-primary transition-colors duration-200 cursor-pointer mt-4"
    >
      <span
        className="text-sm md:text-base tracking-widest uppercase"
        aria-hidden="true"
      >
        Scroll
      </span>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </button>
  );
}
