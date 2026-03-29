'use client';
import { useEffect, useMemo, useState } from 'react';
import { RotatingWordsProps } from '@/app/home/home-types';

export function RotatingWords({ words, interval = 2500 }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  const extendedWords = useMemo(() => [...words, words[0]], [words]);

  useEffect(() => {
    if (!words.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  useEffect(() => {
    if (index !== words.length) return;

    const timeout = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [index, words.length]);

  return (
    <span className="inline-block relative overflow-hidden max-h-[2.5em] font-bold">
      <span
        className={
          animate
            ? 'flex flex-col items-center text-center transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]'
            : 'flex flex-col items-center text-center'
        }
        style={{ transform: `translateY(-${index * 2.5}em)` }}
      >
        {extendedWords.map((word, i) => (
          <span
            key={i}
            className="h-[2.5em] flex items-center justify-center text-center break-words"
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
