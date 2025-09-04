import TypingEffect from '@/app/page-ui/parts/TypingEffect';
import { MainHeroProps } from '@/app/page-ui/types';
import React from 'react';

export const MainHero: React.FC<MainHeroProps> = ({
  text,
  speed,
  deleteSpeed,
  pause,
  mode,
}) => {
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
};
