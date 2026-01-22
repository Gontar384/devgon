import React from 'react';
import { Content } from '@/lib/graphql/graphql-types';

export interface AdminManagerProps {
  contents: Record<string, Content[]>;
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
}

export interface ContentCardProps {
  content: Content;
  contentKey: string;
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
}

export interface MoveCardButtonsProps {
  handleReorderMobile: (
    id: string,
    direction: 'left' | 'right',
  ) => Promise<void>;
  contentId: string;
}
