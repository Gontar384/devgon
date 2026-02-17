import { Content } from '@/content/content-types';

export interface AdminManagerProps {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}

export interface AdminContentErrorBannerProps {
  failedKeys: string[];
}
