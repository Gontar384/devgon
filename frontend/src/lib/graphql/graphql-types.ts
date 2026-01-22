export interface Content {
  id: string;
  key: string;
  title?: string;
  header?: string;
  description?: string;
  images?: string[];
  video?: string;
  order?: number;
  updatedAt: string;
}

export interface UsePageContentsResult {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}
