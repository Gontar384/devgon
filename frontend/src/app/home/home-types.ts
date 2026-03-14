import { Content, ContentOrFallback } from '@/cms/content/content-types';

export interface HomeManagerProps {
  contents: Record<string, Content[]>;
}

export interface HeroProps {
  content: ContentOrFallback;
}

export interface ServiceCardProps {
  content: ContentOrFallback;
}

export interface TypingEffectProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
  mode?: string;
}

export interface RotatingWordsProps {
  words: string[];
  interval?: number;
}
