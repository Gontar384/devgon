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
import { motion } from 'framer-motion';
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

  return (
    <motion.article
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      className="relative flex gap-5 rounded-2xl border bg-background p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
    >
      {hasMetric && (
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 rounded-bl-2xl rounded-tr-2xl bg-primary/8 px-3 py-1.5 text-right"
        >
          <p className="text-[18px] font-black text-primary leading-none">
            {item.metric}
          </p>
          {item.metricLabel && (
            <p className="text-[9px] uppercase tracking-[0.14em] text-primary/70 leading-tight mt-0.5">
              {item.metricLabel}
            </p>
          )}
        </div>
      )}

      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300"
        aria-hidden="true"
      >
        <Icon size={18} />
      </div>

      <div className="flex flex-col gap-1.5 pr-16">
        <h3 className="text-[15px] md:text-[16px] font-semibold leading-snug">
          {item.title}
        </h3>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
