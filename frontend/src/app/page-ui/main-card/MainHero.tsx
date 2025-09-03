import TypingEffect from '@/app/page-ui/parts/TypingEffect';
import { Hero } from '@/app/page-ui/types';
import React from 'react';

export const MainHero: React.FC<Hero> = ({ text }) => {
  return (
    <h1 className="text-6xl font-bold whitespace-nowrap">
      <TypingEffect
        text={text}
        speed={300}
        deleteSpeed={100}
        pause={1000}
        mode="typing"
      />
    </h1>
  );
};
