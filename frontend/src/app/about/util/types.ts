import { AuthUser } from '@/lib/types/auth-types';

export interface AboutMainCardProps {
  title: string;
  description: string;
  editable: boolean;
  role: 'guest' | 'user' | 'admin';
  onSave?: (title: string, description: string) => void;
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

export interface MainCardContentData {
  key: string;
  title?: string;
  description?: string;
  editable: boolean;
}

export interface AboutManagerProps {
  mainCardContent: MainCardContentData;
  authUser: AuthUser;
}
