import React from 'react';

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

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

/**
 * Represents a media item in the editor — either already saved in the database
 * or freshly selected by the user and pending upload.
 *
 * - `existing` — references a saved Media record; carries full Media data
 * - `new` — a local file not yet uploaded; carries a File object and a temporary
 *   object URL for preview (must be revoked on cancel/unmount)
 */
export type MediaItem =
  | { id: string; type: 'existing'; data: Media }
  | { id: string; type: 'new'; data: { file: File; previewUrl: string } };

export interface UsePageContentsResult {
  contents: Record<string, Content[]>;
  error: Error | null;
  failedKeys: string[];
}

export interface ContentCardManagerProps {
  contents: Content[];
  contentKey: string;
  mode: 'single' | 'multiple';
  /**
   * Controls which text fields are displayed and their max character length.
   * A value of `0` means the field is hidden; any positive value sets the limit.
   */
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

export interface MediaUploaderProps {
  media: MediaItem[];
  onMediaChange: (mediaItems: MediaItem[]) => void;
  isEditing: boolean;
  maxMedia?: number;
}

export interface SortableMediaItemProps {
  item: MediaItem;
  onDelete: () => void;
  isEditing: boolean;
  move: (id: string, dir: -1 | 1) => void;
}
