import {
  Content,
  ContentOrFallback,
  MediaType,
} from '@/cms/content/content-types';
import React from 'react';

export interface HomeManagerProps {
  contents: Record<string, Content[]>;
}

export interface HomeHeroProps {
  content: ContentOrFallback;
}

export interface HomeServiceCardProps {
  content: ContentOrFallback;
  priority?: boolean;
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

export interface HomeServicesCarouselProps {
  children: React.ReactNode[];
  count: number;
}

export interface TiltCardProps {
  children: React.ReactNode;
}

export interface ScrollRevealImageProps {
  src: string;
  alt: string;
  type?: MediaType;
  badge: { title: string; subtitle: string };
}

export interface HomeProblemSectionProps {
  content: ContentOrFallback;
}

export type ProblemIcon = 'clock' | 'chaos' | 'rocket' | 'zap';

export interface ProblemItem {
  icon: ProblemIcon;
  tag: string;
  problem: string;
  solution: string;
}
