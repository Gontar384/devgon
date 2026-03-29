'use client';

import { useState, useEffect, useMemo } from 'react';
import { TypingEffectProps } from '@/app/home/home-types';

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function TypingEffect({
  text,
  speed = 300,
  deleteSpeed = 100,
  emptyWordPause = 1000,
  fullWordPause = 1000,
  mode = 'typing',
}: TypingEffectProps) {
  const plainText = useMemo(() => stripHTML(text), [text]);
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [forward, setForward] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (mode !== 'typing') return;

    let timeout: NodeJS.Timeout;

    if (forward) {
      if (index < plainText.length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + plainText[index]);
          setIndex(index + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setForward(false);
        }, fullWordPause);
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setForward(true);
        }, emptyWordPause);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    index,
    forward,
    plainText,
    speed,
    deleteSpeed,
    emptyWordPause,
    fullWordPause,
    mode,
  ]);

  if (!plainText) return null;

  return (
    <span>
      {mode === 'typing' ? displayed : plainText}
      <span
        className={`inline-block h-[1em] w-[2px] bg-current align-middle text-primary transition-opacity duration-150 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </span>
  );
}
