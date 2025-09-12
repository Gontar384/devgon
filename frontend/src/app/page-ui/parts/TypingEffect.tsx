'use client';

import { useState, useEffect } from 'react';
import { TypingEffectProps } from '@/app/page-ui/types';

export function TypingEffect({
  text,
  speed = 300,
  deleteSpeed = 100,
  pause = 1000,
  mode = 'typing',
}: TypingEffectProps) {
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
      if (index < text.length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + text[index]);
          setIndex(index + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setForward(false);
        }, pause);
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
        }, pause);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, forward, text, speed, deleteSpeed, pause, mode]);

  return (
    <span>
      {mode === 'typing' ? displayed : text}
      <span
        className={`inline-block h-[1em] w-[2px] bg-current align-middle text-primary transition-opacity duration-150 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </span>
  );
}
