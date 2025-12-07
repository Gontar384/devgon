import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/core';
import { EditorOptions } from '@/components/tiptap/tiptap-types';
import { CharacterCount } from '@tiptap/extensions';
import Link from '@tiptap/extension-link';

export const useBigEditor = (options: EditorOptions): Editor | null => {
  const { initialContent, contentLength } = options;

  return useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        link: false,
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-secondary underline',
        },
      }),
      CharacterCount.configure({
        limit: contentLength,
      }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'w-full focus:outline-none' } },
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      (editor.storage as unknown as Record<string, string>).type = 'big';
    },
  });
};
