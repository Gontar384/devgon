'use client';

import { useEffect, useState } from 'react';
import { RotatingWordsProps } from '@/app/home/home-types';

export function RotatingWords({ words, interval = 2500 }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  const extendedWords = [...words, words[0]];

  useEffect(() => {
    if (!words.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  useEffect(() => {
    if (index === words.length) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimate(true);
          });
        });
      }, 500);
    }
  }, [index, words.length]);

  return (
    <span className="inline-block relative overflow-hidden h-[1.4em] font-bold">
      <span
        className={`flex flex-col ${
          animate
            ? 'transition-[transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)]'
            : ''
        }`}
        style={{ transform: `translateY(-${index * 1.4}em)` }}
      >
        {extendedWords.map((word, i) => (
          <span key={i} className="h-[1.4em] flex items-center justify-center">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
