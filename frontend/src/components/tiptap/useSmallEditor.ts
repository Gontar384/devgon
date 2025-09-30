import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/core';
import { EditorOptions } from '@/components/tiptap/types';
import { CharacterCount } from '@tiptap/extensions';

export const useSmallEditor = (options: EditorOptions): Editor | null => {
  const { initialContent, contentLength } = options;

  return useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      CharacterCount.configure({
        limit: contentLength,
      }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'w-full focus:outline-none' } },
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      (editor.storage as unknown as Record<string, string>).type = 'small';
    },
  });
};
