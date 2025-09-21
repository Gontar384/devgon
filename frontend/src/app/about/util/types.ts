export interface AboutMainCardProps {
  title: string;
  description: string;
  editable: boolean;
}

export interface Content {
  key: string;
  title?: string;
  description?: string;
  editable: boolean;
}

export interface GetContentData {
  getContent: Content;
}

export interface UpsertContentData {
  upsertContent: {
    title?: string;
    description?: string;
  };
}
