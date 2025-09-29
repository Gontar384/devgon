import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/core';
import { EditorOptions } from '@/components/tiptap/types';

export const useBigEditor = (options: EditorOptions): Editor | null => {
  const { initialContent } = options;

  return useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        underline: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-6',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-6',
        },
      }),
      ListItem,
      Underline,
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'w-full focus:outline-none' } },
    immediatelyRender: false,
  });
};
