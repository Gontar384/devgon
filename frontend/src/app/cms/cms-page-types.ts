import { Content, ContentOrFallback } from '@/cms/content/content-types';

export interface CmsManagerProps {
  contents: Record<string, Content[]>;
}

export interface CmsHeroProps {
  content: ContentOrFallback;
}

export interface CmsBreakdownProps {
  content: ContentOrFallback;
}

export interface CmsWhyProps {
  content: ContentOrFallback;
}

export interface CmsPreviewProps {
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
