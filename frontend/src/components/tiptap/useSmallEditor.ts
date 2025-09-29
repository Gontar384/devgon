import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/core';
import { EditorOptions } from '@/components/tiptap/types';

export const useSmallEditor = (options: EditorOptions): Editor | null => {
  const { initialContent } = options;

  return useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'w-full focus:outline-none' } },
    immediatelyRender: false,
  });
};
