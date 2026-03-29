'use client';

import { MediaType } from '@/cms/content/content-types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HomeIntroImageProps } from '@/app/home/home-types';
import { useDeviceStore } from '@/store/deviceStore';
import { useMobileBarStore } from '@/store/mobileBarStore';

export function HomeIntroImage({
  photoUrl,
  photoAlt,
  mediaType,
}: HomeIntroImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceStore();
  const { openedBar } = useMobileBarStore();
  const isVideo = mediaType === MediaType.VIDEO;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    openedBar ? ['0%', '0%'] : isMobile ? ['-10%', '10%'] : ['-12%', '12%'],
  );
  const scale = isMobile ? 1.1 : 1.25;

  if (!photoUrl) return null;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        {isVideo ? (
          <video
            src={photoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={photoUrl}
            alt={photoAlt}
            fill
            unoptimized
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
      </motion.div>
    </div>
  );
}
