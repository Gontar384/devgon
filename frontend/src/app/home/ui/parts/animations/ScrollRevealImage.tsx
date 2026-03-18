'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { MediaType } from '@/cms/content/content-types';
import { ScrollRevealImageProps } from '@/app/home/home-types';

const CONTAINER_ASPECT_RATIO = '4/5';
const MOBILE_ASPECT_RATIO = '16/9';

export function ScrollRevealImage({
  src,
  alt,
  type,
  badge,
}: ScrollRevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0.0, 0.7],
    ['inset(100% 0% 0% 0% round 16px)', 'inset(0% 0% 0% 0% round 16px)'],
  );

  const media =
    type === MediaType.VIDEO ? (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />
    ) : (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={true}
        draggable={false}
        className="object-cover select-none pointer-events-none"
      />
    );

  return (
    <>
      <motion.div
        className="block lg:hidden w-full overflow-hidden rounded-2xl bg-muted"
        style={{ aspectRatio: MOBILE_ASPECT_RATIO }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="relative w-full h-full">{media}</div>
      </motion.div>
      <motion.div
        ref={ref}
        className="hidden lg:block sticky top-[100px] self-start w-full"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl bg-muted group cursor-pointer"
          style={{ aspectRatio: CONTAINER_ASPECT_RATIO, clipPath }}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            {media}
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </div>
          {badge.title && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/90 backdrop-blur-md border shadow-lg"
            >
              <p className="text-[13px] md:text-[14px] font-medium leading-snug">
                {badge.title}
              </p>
              <p className="text-[11px] md:text-[12px] text-muted-foreground mt-1 uppercase tracking-widest">
                {badge.subtitle}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
