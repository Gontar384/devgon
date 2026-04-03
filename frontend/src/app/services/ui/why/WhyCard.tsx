'use client';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Eye,
  Gauge,
  HeartHandshake,
  Lock,
  LucideIcon,
  Repeat,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { WhyItem } from '@/app/services/service-page-types';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Shield,
  TrendingUp,
  HeartHandshake,
  Clock,
  AlertTriangle,
  Repeat,
  Eye,
  Gauge,
  Target,
  DollarSign,
  Lock,
};

export function WhyCard({ item, index }: { item: WhyItem; index: number }) {
  const Icon = ICONS[item.icon] ?? Zap;
  const hasMetric = !!item.metric;
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              x: -6,
              scale: 1.015,
              transition: { duration: 0.18, ease: 'easeOut' },
            }
      }
      whileTap={
        prefersReduced
          ? undefined
          : {
              x: -4,
              scale: 1.008,
              transition: { duration: 0.1, ease: 'easeOut' },
            }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onTouchCancel={() => setHovered(false)}
      className="relative flex gap-3 md:gap-5 rounded-2xl border bg-background p-4 md:p-6 hover:shadow-md active:shadow-md hover:border-primary/50 active:border-primary/50
                 transition-[box-shadow,border-color] duration-300"
    >
      {hasMetric && (
        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? { opacity: 1, scale: 1, y: 0 }
              : hovered
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.85, y: -4 }
          }
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute -top-0.5 -right-0.5 max-w-[180px] rounded-bl-2xl rounded-tr-xl bg-primary px-3 py-1.5 text-right text-primary-foreground/90 overflow-hidden"
        >
          <p className="text-[18px] font-black leading-none truncate">
            {item.metric}
          </p>
          {item.metricLabel && (
            <p className="text-[10px] uppercase tracking-[0.14em] leading-tight mt-0.5 truncate">
              {item.metricLabel}
            </p>
          )}
        </motion.div>
      )}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5
                   ${hovered ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'} transition-all duration-200`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="text-[15px] md:text-[16px] font-semibold leading-snug line-clamp-2">
          {item.title}
        </h3>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
