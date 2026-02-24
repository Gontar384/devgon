import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/core';
import { EditorOptions } from '@/cms/content/util/tiptap/tiptap-types';
import { CharacterCount } from '@tiptap/extensions';
import Link from '@tiptap/extension-link';
import { PlainTextPaste } from '@/cms/content/util/tiptap/pasteSanitizer';

/**
 * Tiptap editor instance configured for multiline rich text.
 * Supports bullet/ordered lists in addition to the base formatting.
 * Sets `editor.storage.type = "big"` on creation so TiptapToolbar
 * can conditionally render list controls.
 * Returns `null` when `enabled` is false, allowing conditional mounting.
 */
export const useBigEditor = (options: EditorOptions): Editor | null => {
  const { initialContent, contentLength, enabled } = options;

  const editor = useEditor({
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
      PlainTextPaste,
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'w-full focus:outline-none' } },
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      (editor.storage as unknown as Record<string, string>).type = 'big';
    },
  });

  return enabled ? editor : null;
};
