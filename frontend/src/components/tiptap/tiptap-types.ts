import { LucideIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';

export interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
  title: string;
}

export interface TiptapToolbarProps {
  editor: Editor | null;
}

export interface EditorOptions {
  initialContent: string;
  contentLength: number;
  enabled?: boolean;
}
