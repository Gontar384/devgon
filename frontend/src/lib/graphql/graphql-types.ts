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
