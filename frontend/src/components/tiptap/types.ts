import { LucideIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';

export interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
  title: string;
}

type ToolbarSize = 'small' | 'big';

export interface TiptapToolbarProps {
  editor: Editor | null;
  size: ToolbarSize;
}

export interface EditorOptions {
  initialContent: string;
}
