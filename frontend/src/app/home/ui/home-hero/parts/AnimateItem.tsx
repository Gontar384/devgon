'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { AnimateItemProps } from '@/app/home/home-types';

export function AnimateItem({
  children,
  delay = 0,
  className,
}: AnimateItemProps) {
  return (
    <motion.div
      className={`relative ${className ?? ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
