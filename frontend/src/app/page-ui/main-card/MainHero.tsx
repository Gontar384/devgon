import { TypingEffect } from '@/app/page-ui/parts/TypingEffect';
import { MainHeroProps } from '@/app/page-ui/types';
import React from 'react';

export function MainHero({
  text,
  speed,
  deleteSpeed,
  pause,
  mode,
}: MainHeroProps) {
  return (
    <h1 className="text-6xl font-bold whitespace-nowrap">
      <TypingEffect
        text={text}
        speed={speed}
        deleteSpeed={deleteSpeed}
        pause={pause}
        mode={mode}
      />
    </h1>
  );
}
