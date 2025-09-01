'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number; // czas między literami w ms
  pause?: number; // pauza po napisaniu/wykasowaniu tekstu
}

export default function TypingEffect({
  text,
  speed = 150,
  pause = 1000,
}: TypingEffectProps) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [forward, setForward] = useState(true); // true = piszemy, false = kasujemy
  const [showCursor, setShowCursor] = useState(true);

  // Migający kursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (forward) {
        // Pisanie do przodu
        if (index < text.length) {
          setDisplayed((prev) => prev + text[index]);
          setIndex(index + 1);
        } else {
          setForward(false);
          setTimeout(() => {}, pause);
        }
      } else {
        // Kasowanie tekstu
        if (index > 0) {
          setDisplayed((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        } else {
          setForward(true);
          setTimeout(() => {}, pause);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, forward, text, speed, pause]);

  return (
    <span>
      {displayed}
      <span
        className={`inline-block h-[1em] w-[2px] bg-current align-bottom text-primary ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </span>
  );
}
