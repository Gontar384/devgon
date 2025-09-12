import { TypingEffect } from '@/app/page-ui/parts/TypingEffect';
import { SideHeroProps } from '../types';
import React from 'react';

export function SideHero({ text, mode }: SideHeroProps) {
  return (
    <h2 className="text-2xl font-bold whitespace-nowrap">
      <TypingEffect text={text} mode={mode} />
    </h2>
  );
}
