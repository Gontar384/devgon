import { Content } from '@/cms/content/content-types';

export interface AdminManagerProps {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}
