import { Content } from '@/cms/content/content-types';

export interface HomeManagerProps {
  contents: Record<string, Content[]>;
}

export interface MainCardProps {
  content: Content;
}

export interface SideCardProps {
  content: Content;
}

export interface TypingEffectProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
  mode?: string;
}
