'use client';

import { useEffect, useState } from 'react';
import { RotatingWordsProps } from '@/app/home/home-types';

export function RotatingWords({ words, interval = 2500 }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!words.length) return;

    const timer = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setVisible(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className="inline-block relative overflow-hidden h-[1.2em]">
      <span
        className={` transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}
