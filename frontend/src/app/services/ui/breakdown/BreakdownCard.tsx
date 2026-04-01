import { BreakdownItem } from '@/app/services/service-page-types';
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Cloud,
  Database,
  FileText,
  GitMerge,
  Globe,
  Layers,
  LucideIcon,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

const ICONS: Record<string, LucideIcon> = {
  ShoppingCart,
  Globe,
  Layers,
  Database,
  Smartphone,
  Cloud,
  GitMerge,
  Workflow,
  ArrowLeftRight,
  Bell,
  FileText,
  BarChart3,
  Bot,
  BrainCircuit,
  TrendingUp,
  Search,
  SlidersHorizontal,
};

export function BreakdownCard({
  item,
  index,
}: {
  item: BreakdownItem;
  index: number;
}) {
  const Icon = ICONS[item.icon] ?? Globe;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
      className="group relative flex flex-col gap-4 rounded-2xl border bg-background p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Number watermark */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-5 text-[52px] font-black text-muted-foreground/5 leading-none select-none group-hover:text-primary/8 transition-colors"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[16px] md:text-[17px] font-semibold leading-snug">
          {item.title}
        </h3>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>

      {item.tags?.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 mt-auto"
          role="list"
          aria-label="Technologie i obszary"
        >
          {item.tags.map((tag, i) => (
            <span
              key={i}
              role="listitem"
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
