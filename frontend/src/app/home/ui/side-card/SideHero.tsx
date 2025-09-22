import { TypingEffect } from '@/app/home/ui/parts/TypingEffect';
import { SideHeroProps } from '../../util/types';
import React from 'react';

export function SideHero({ text, mode }: SideHeroProps) {
  return (
    <h2 className="text-2xl font-bold whitespace-nowrap">
      <TypingEffect text={text} mode={mode} />
    </h2>
  );
}
