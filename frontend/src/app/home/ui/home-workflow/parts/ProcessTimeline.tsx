'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ProcessTimelineProps } from '@/app/home/home-types';

const CARDS_PER_ROW = 4;

export function ProcessTimeline({ items }: ProcessTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 100%', 'end 40%'],
  });

  const rowCount = Math.ceil(items.length / CARDS_PER_ROW);

  const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
    items.slice(rowIndex * CARDS_PER_ROW, (rowIndex + 1) * CARDS_PER_ROW),
  );

  const rowLineScales = rows.map((_, rowIndex) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(
      scrollYProgress,
      [rowIndex / rowCount, (rowIndex + 1) / rowCount],
      [0, 1],
    ),
  );

  const mobileLineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <div className="lg:hidden absolute left-9 top-0 bottom-0 w-0.5 bg-muted-foreground/20">
        <motion.div
          style={{ scaleY: mobileLineScale }}
          className="absolute top-0 left-0 w-full bg-primary origin-top h-full"
        />
      </div>
      <div className="lg:hidden flex flex-col gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            viewport={{ once: true }}
            className="relative flex gap-6"
            onTouchStart={() => setActive(i)}
            onTouchEnd={() => setActive(null)}
          >
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative z-10 w-10 h-10 flex items-center justify-center text-xl font-bold text-secondary/60">
                {i + 1}
              </div>
              <div
                className={`w-3 h-3 rounded-full bg-primary flex-shrink-0 transition-transform duration-200 ${active === i ? 'scale-150' : ''}`}
              />
              {i < items.length - 1 && (
                <div className="flex-1 w-0.5 bg-transparent mt-2" />
              )}
            </div>
            <div
              className={`flex-1 p-5 rounded-xl border bg-background transition-all duration-200 ${active === i ? 'scale-105 shadow-lg' : ''}`}
            >
              <h3 className="font-semibold text-base line-clamp-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed line-clamp-4">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="hidden lg:flex flex-col gap-30">
        {rows.map((rowItems, rowIndex) => (
          <div key={rowIndex} className="relative">
            <motion.div
              style={{ scaleX: rowLineScales[rowIndex] }}
              className="absolute top-[22px] left-0 right-0 h-0.5 bg-primary origin-left"
            />
            <div
              className="grid gap-8 items-stretch"
              style={{
                gridTemplateColumns: `repeat(${Math.min(rowItems.length, CARDS_PER_ROW)}, minmax(0, 1fr))`,
              }}
            >
              {rowItems.map((item, i) => {
                const globalIndex = rowIndex * CARDS_PER_ROW + i;
                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="relative text-center max-h-[170px]"
                    onMouseEnter={() => setActive(globalIndex)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <div className="z-10 absolute -top-12 left-1/2 -translate-x-1/2 text-5xl font-bold text-secondary/60">
                      {globalIndex + 1}
                    </div>
                    <div
                      className={`mx-auto mt-4 mb-6 w-3 h-3 rounded-full bg-primary transition-transform duration-200 ${active === globalIndex ? 'scale-150' : ''}`}
                    />
                    <div
                      className={`h-full min-h-[80px] pt-4 px-3 rounded-xl border bg-background overflow-hidden transition-all duration-200 ${active === globalIndex ? 'scale-105 shadow-lg' : ''}`}
                    >
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed line-clamp-4">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
