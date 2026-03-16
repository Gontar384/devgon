'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeServicesProps } from '@/app/home/home-types';

const MOBILE_INITIAL = 3;
const GAP = 32;

export function HomeServicesCarousel({ children, count }: HomeServicesProps) {
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(3);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const mouseStart = useRef<number | null>(null);
  const isDragging = useRef(false);

  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const v = w < 1024 ? 2 : 3;
      setVisible(v);
      if (containerRef.current) {
        const totalWidth = containerRef.current.offsetWidth;
        setCardWidth((totalWidth - GAP * (v - 1)) / v + 2);
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + visible < count;

  const go = (dir: 1 | -1) => {
    if (dir === 1 && !canNext) return;
    if (dir === -1 && !canPrev) return;
    setOffset((o) => Math.min(Math.max(o + dir, 0), count - visible));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    touchStart.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStart.current = e.clientX;
    isDragging.current = false;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStart.current === null) return;
    if (Math.abs(e.clientX - mouseStart.current) > 5) isDragging.current = true;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStart.current === null) return;
    const diff = mouseStart.current - e.clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    mouseStart.current = null;
  };
  const onMouseLeave = () => {
    mouseStart.current = null;
  };

  const mobileVisible = expanded
    ? childrenArray
    : childrenArray.slice(0, MOBILE_INITIAL);
  const hasMore = count > MOBILE_INITIAL;

  // szerokość karty — px gdy obliczona, CSS fallback przed hydracją
  const slotStyle = (cw: number | null) =>
    cw ? { width: cw, minWidth: cw } : undefined;
  const slotClass = (cw: number | null) =>
    `flex-shrink-0${cw ? '' : ' w-1/2 lg:w-1/3'}`;

  return (
    <div className="relative w-full">
      {/* MOBILE */}
      <div className="flex flex-col gap-6 sm:hidden px-4 py-2">
        <AnimatePresence initial={false}>
          {mobileVisible.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i >= MOBILE_INITIAL ? (i - MOBILE_INITIAL) * 0.1 : 0,
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMore && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
            {expanded ? 'Zwiń' : `Pokaż więcej (${count - MOBILE_INITIAL})`}
          </button>
        )}
      </div>

      {/* TABLET / DESKTOP */}
      <div className="hidden sm:block overflow-hidden">
        <div className="px-6 py-3">
          <div
            ref={containerRef}
            className="select-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <motion.div
              className="flex gap-8"
              animate={{ x: cardWidth ? -(offset * (cardWidth + GAP)) : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {childrenArray.map((child, i) => (
                <div
                  key={i}
                  style={
                    cardWidth
                      ? { width: cardWidth, minWidth: cardWidth, flexShrink: 0 }
                      : undefined
                  }
                  className={`flex-shrink-0${!cardWidth ? ' w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]' : ''}`}
                >
                  {child}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {count > visible && (
        <div className="hidden sm:flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => go(-1)}
            disabled={!canPrev}
            className="p-2 rounded-full border hover:scale-105 active:scale-95 transition duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: count }).map((_, i) => {
              const isActive = i >= offset && i < offset + visible;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (i < offset) {
                      setOffset(Math.min(i, count - visible));
                    } else {
                      setOffset(
                        Math.min(Math.max(i - visible + 1, 0), count - visible),
                      );
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-primary w-4 pointer-events-none'
                      : 'bg-muted-foreground/40 w-2 cursor-pointer hover:bg-primary/50'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={() => go(1)}
            disabled={!canNext}
            className="p-2 rounded-full border hover:scale-105 active:scale-95 transition duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
