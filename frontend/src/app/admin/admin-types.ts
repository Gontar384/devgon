import React from 'react';
import { Content } from '@/lib/graphql/graphql-types';

export interface AdminManagerProps {
  contents: Record<string, Content[]>;
}

interface BaseContentProps {
  contentKey: string;
  isTitle?: boolean;
  isHeader?: boolean;
  isDescription?: boolean;
}

export interface ContentCardProps extends BaseContentProps {
  content: Content;
  contentKeyHeader?: boolean;
  hoverable?: boolean;
  upsertById?: boolean;
  onDelete?: (id: string) => void;
  sortable?: boolean;
  sortableId?: string;
  moveCard?: (id: string, direction: 'left' | 'right') => Promise<void>;
}

export interface ContentCardListProps extends BaseContentProps {
  contents: Content[];
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
  onDelete: (id: string) => void;
  contentId: string;
}

export interface EditPopupUtilProps {
  isEditing: boolean;
  placeholderHeight: number;
  placeholderWidth: number;
}

export interface MoveCardButtonsProps {
  moveCard: (id: string, direction: 'left' | 'right') => Promise<void>;
  contentId: string;
}
