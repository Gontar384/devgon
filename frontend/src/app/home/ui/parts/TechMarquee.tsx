'use client';

import { useMotionValue, useAnimationFrame, motion } from 'framer-motion';
import Image from 'next/image';
import { MediaType } from '@/cms/content/content-types';
import { TechMarqueeProps } from '@/app/home/home-types';
import { useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TechMarquee({ logos }: TechMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pausedRef = useRef(false);
  const x = useMotionValue(0);
  const speed = 100;

  const loopLogos = [...logos, ...logos, ...logos];

  useAnimationFrame((_, delta) => {
    if (pausedRef.current) return;
    if (!marqueeRef.current) return;

    const totalWidth = (
      marqueeRef.current.children[logos.length] as HTMLElement
    )?.offsetLeft;
    if (!totalWidth) return;

    const current = x.get();
    const next = current - (delta / 1000) * speed;

    x.set(next <= -totalWidth ? next + totalWidth : next);
  });

  const handleLogoEnter = (index: number) => {
    pausedRef.current = true;
    setActiveIndex(index);
  };

  const handleLogoLeave = () => {
    pausedRef.current = false;
    setActiveIndex(null);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative w-full overflow-hidden">
        <motion.div
          ref={marqueeRef}
          style={{ x }}
          className="flex gap-4 md:gap-12 w-max will-change-transform py-2"
        >
          {loopLogos.map((logo, i) => (
            <Tooltip key={`${logo.src}-${i}`} open={activeIndex === i}>
              <TooltipTrigger asChild>
                <div
                  className={`relative flex flex-col items-center justify-center
                              min-w-[100px] md:min-w-[140px]
                              h-[50px] md:h-[70px]
                              opacity-80 transition-all duration-300
                              hover:opacity-100 hover:scale-110
                              ${activeIndex === i ? 'scale-110 opacity-100' : ''}`}
                  onMouseEnter={() => handleLogoEnter(i)}
                  onMouseLeave={handleLogoLeave}
                  onTouchStart={() => handleLogoEnter(i)}
                  onTouchEnd={handleLogoLeave}
                >
                  {logo.type === MediaType.VIDEO ? (
                    <video
                      src={logo.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full object-contain"
                      aria-label={logo.alt}
                    />
                  ) : (
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={100}
                      height={70}
                      unoptimized
                      draggable={false}
                      className="object-contain max-h-[55px] md:max-h-[70px] max-w-[70px] md:max-w-[100px]"
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{logo.alt}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
