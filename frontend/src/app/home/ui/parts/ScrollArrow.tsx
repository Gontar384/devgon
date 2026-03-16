'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollArrow() {
  const handleClick = () => {
    window.scrollTo({ top: window.innerHeight + 64, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary active:text-primary transition-colors duration-200 cursor-pointer mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <span className="text-sm md:text-base tracking-widest uppercase">
        Przewiń
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </motion.button>
  );
}