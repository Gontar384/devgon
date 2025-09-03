import TypingEffect from '@/app/page-ui/parts/TypingEffect';
import { Hero } from '../types';
import React from 'react';

export const SideHero: React.FC<Hero> = ({ text }) => {
  return (
    <h2 className="text-2xl font-bold whitespace-nowrap">
      <TypingEffect text={text} mode="cursor" />
    </h2>
  );
};
