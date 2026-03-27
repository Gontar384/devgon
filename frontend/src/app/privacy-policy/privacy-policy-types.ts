import { ContentOrFallback } from '@/cms/content/content-types';

export interface PrivacyPolicyManagerProps {
  contents: Record<string, ContentOrFallback[]>;
}

export interface PrivacyPolicyProps {
  info: ContentOrFallback;
  sections: ContentOrFallback[];
}

export interface PrivacyPolicySectionProps {
  index: number;
  content: ContentOrFallback;
}
