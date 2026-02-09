export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface Media {
  id: string;
  filename: string;
  mimeType: string;
  type: MediaType;
  size: number;
  alt?: string;
  order: number;
  contentId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  key: string;
  title?: string;
  header?: string;
  description?: string;
  media?: Media[];
  order?: number;
  updatedAt: string;
}

export interface UsePageContentsResult {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}
