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
}

export interface ContentCardListProps extends BaseContentProps {
  contents: Content[];
}

export interface SortableCardProps extends ContentCardProps {
  onDelete: (id: string) => void;
}

export interface EditableFieldProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type: 'small' | 'big';
  contentLength: number;
  isEditing: boolean;
}

export interface EditButtonsProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  handleCancel: () => void;
}
