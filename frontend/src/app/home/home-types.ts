import { Content, ContentOrFallback } from '@/cms/content/content-types';
import React from 'react';

export interface HomeManagerProps {
  contents: Record<string, Content[]>;
}

export interface HomeHeroProps {
  content: ContentOrFallback;
}

export interface HomeServiceCardProps {
  content: ContentOrFallback;
}

export interface TypingEffectProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  emptyWordPause?: number;
  fullWordPause?: number;
  mode?: string;
}

export interface RotatingWordsProps {
  words: string[];
  interval?: number;
}

export interface AnimateClientProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export interface HomeServicesProps {
  children: React.ReactNode[];
  count: number;
}
