import { ToolbarButtonProps } from '@/components/tiptap/tiptap-types';
import React from 'react';

export const ToolbarButton = ({
  icon: Icon,
  onClick,
  isActive,
  title,
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className={`p-1 rounded ${isActive ? 'bg-gray-400/50' : 'hover:bg-gray-100'}`}
    title={title}
    type="button"
  >
    <Icon className="w-4 h-4" />
  </button>
);
