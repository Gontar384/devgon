'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MediaType } from '@/cms/content/content-types';
import { MediaContainerProps } from '@/app/home/home-types';

export function MediaContainer({ src, alt, type }: MediaContainerProps) {
  return (
    <motion.div
      className="relative w-full max-w-[350px] md:max-w-[450px] pointer-events-none"
      animate={{
        rotate: [0, 1, -1, 0],
        scale: [1, 1.03, 0.97, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      {type === MediaType.VIDEO ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="rounded-2xl object-cover w-full h-full"
          aria-label={alt || 'Media sekcji O mnie'}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={450}
          height={450}
          unoptimized
          className="rounded-2xl object-cover w-full h-full"
        />
      )}
    </motion.div>
  );
}
