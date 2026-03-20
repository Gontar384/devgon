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
      className={`relative ${className ?? ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
