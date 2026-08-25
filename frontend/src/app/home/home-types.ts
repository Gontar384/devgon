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

export interface HomeIntroProps {
  content: ContentOrFallback;
}

export interface HomeIntroImageProps {
  photoUrl: string;
  photoAlt: string;
  mediaType: MediaType;
}

export interface HomeProjectCardProps {
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

export interface AnimateItemProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export interface HomeProjectsCarouselProps {
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

export interface HomeExperienceProps {
  content: ContentOrFallback;
}

export type ExperienceIcon = 'briefcase' | 'code' | 'graduation';

export interface ExperienceItem {
  icon: ExperienceIcon;
  period: string;
  role: string;
  company: string;
  bullets: string[];
}

export interface HomeTechProps {
  content: ContentOrFallback;
}

type Logo = {
  src: string;
  alt: string;
  type: MediaType;
};

export interface MediaMarqueeProps {
  logos: Logo[];
}

export interface HomeWorkflowProps {
  content: ContentOrFallback;
}

type ProcessItem = {
  title: string;
  description: string;
};

export interface ProcessTimelineProps {
  items: ProcessItem[];
}

export interface HomeAboutProps {
  content: ContentOrFallback;
}

export interface MediaContainerProps {
  src: string;
  alt: string;
  type: MediaType;
}

type CursorColor = 'primary' | 'muted';

export interface CursorGlowProps {
  cursorColor: CursorColor;
}

export interface NavigationButtonProps {
  href: string;
  label: string;
  primary?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export interface HomeContactProps {
  content: ContentOrFallback;
}
