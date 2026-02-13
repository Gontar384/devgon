import React from 'react';
import { Content, Media } from '@/lib/graphql/graphql-types';

export interface AdminManagerProps {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}

export interface ContentCardManagerProps {
  contents: Content[];
  contentKey: string;
  mode: 'single' | 'multiple';
  fields: {
    title: number;
    header: number;
    description: number;
  };
  maxMedia?: number;
}

export interface ContentCardProps {
  content: Content;
  singleMode: boolean;
  fields: {
    title: number;
    header: number;
    description: number;
  };
  handleRevalidate: () => Promise<void>;
  handleReorderMobile: (
    id: string,
    direction: 'left' | 'right',
  ) => Promise<void>;
  maxMedia?: number;
}

export interface AddCardButtonProps {
  contentKey: string;
  isAvailable: boolean;
  handleAdd: () => Promise<void>;
  singleMode: boolean;
}

export interface EditPopupUtilProps {
  isEditing: boolean;
  placeholderHeight: number;
  placeholderWidth: number;
}

export interface EditableFieldProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type: 'small' | 'big';
  contentLength: number;
  isEditing: boolean;
  header: 'Title' | 'Header' | 'Description';
}

export interface EditButtonsProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  handleCancel: () => void;
  updatedAt: string;
  isLoading: boolean;
}

export interface DeleteCardButtonProps {
  handleDelete: (id: string) => Promise<void>;
  contentId: string;
  isEditing: boolean;
}

export interface MoveCardButtonsProps {
  handleReorderMobile: (
    id: string,
    direction: 'left' | 'right',
  ) => Promise<void>;
  contentId: string;
}

export interface AdminContentErrorBannerProps {
  failedKeys: string[];
}

export interface MediaUploaderProps {
  media: Media[];
  onMediaChange: (params: {
    newFiles: File[];
    existingIds: string[];
    deleteIds: string[];
  }) => void;
  isEditing: boolean;
  maxMedia?: number;
}

export interface SortableMediaItemProps {
  item: MediaItem;
  onDelete: () => void;
  isEditing: boolean;
  move: (id: string, dir: -1 | 1) => void;
}

export type MediaItem =
  | { id: string; type: 'existing'; data: Media }
  | { id: string; type: 'new'; data: { file: File; previewUrl: string } };
