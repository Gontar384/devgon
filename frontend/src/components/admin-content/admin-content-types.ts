import React from 'react';
import { Content } from '@/lib/graphql/graphql-types';

export interface ContentCardProps {
  id?: string;
  contentKey?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  header?: string;
  description?: string;
  images?: string[];
  video?: string;
  role: 'guest' | 'user' | 'admin';
  mutate?: (
    data?: Content | null | Promise<Content | null> | undefined,
    shouldRevalidate?: boolean,
  ) => Promise<Content | null | undefined>;
}

export interface EditableFieldProps {
  value: string;
  isEditing: boolean;
  type: 'small' | 'big';
  contentLength: number;
  onChange: (value: string) => void;
}

export interface EditButtonsProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
  handleSave: () => void;
}
