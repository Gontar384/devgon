'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { AnimateClientProps } from '@/app/home/home-types';

export function AnimateItem({
  children,
  delay = 0,
  className,
}: AnimateClientProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
