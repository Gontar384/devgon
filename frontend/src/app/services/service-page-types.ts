import { ContentOrFallback } from '@/cms/content/content-types';

export interface ServicePageManagerProps {
  contents: Record<string, ContentOrFallback[]>;
  slug: 'systems' | 'integrations' | 'ai';
}

export interface ServiceHeroProps {
  content: ContentOrFallback;
}

export interface ServiceBreakdownProps {
  content: ContentOrFallback;
}

export interface ServiceWhyProps {
  content: ContentOrFallback;
}

export interface BreakdownItem {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface WhyItem {
  icon: string;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
}
