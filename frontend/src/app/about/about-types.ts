import { Content } from '@/content/content-types';

export interface AboutManagerProps {
  contents: Record<string, Content[]>;
}

export interface AboutCardProps {
  content: Content;
}
