'use client';
import {
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ToolbarButton } from '@/components/tiptap/ToolbarButton';
import { TiptapToolbarProps } from '@/components/tiptap/types';

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const [, setUpdateCounter] = useState(0);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState('');
  const linkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;
    const forceUpdate = () => {
      setUpdateCounter((prev) => prev + 1);
    };
    editor.on('update', forceUpdate);
    editor.on('selectionUpdate', forceUpdate);
    return () => {
      editor.off('update', forceUpdate);
      editor.off('selectionUpdate', forceUpdate);
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (linkRef.current && !linkRef.current.contains(event.target as Node)) {
        setShowLinkInput(false);
        setUrl('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLinkInput(false);
        setUrl('');
      }
    };

    if (showLinkInput) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showLinkInput]);

  if (!editor) return null;

  const isBig =
    (editor.storage as unknown as Record<string, string>).type === 'big';

  const charCount = editor.storage.characterCount?.characters?.() ?? 0;
  const limit =
    editor.extensionManager.extensions.find(
      (ext) => ext.name === 'characterCount',
    )?.options.limit ?? 1000;

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b mb-2">
      <ToolbarButton
        icon={Bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Pogrubienie"
      />
      <ToolbarButton
        icon={Italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Kursywa"
      />
      <ToolbarButton
        icon={Underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Podkreślenie"
      />
      <ToolbarButton
        icon={LinkIcon}
        onClick={() => setShowLinkInput((prev) => !prev)}
        isActive={editor.isActive('link')}
        title="Dodaj link"
      />
      {showLinkInput && (
        <div
          className="absolute z-35 mt-2 mr-1 p-2 bg-accent border rounded-sm shadow flex flex-wrap gap-1"
          ref={linkRef}
        >
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border px-2 py-1 rounded text-sm w-60"
          />
          <button
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-sm"
            onClick={() => {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
              setShowLinkInput(false);
              setUrl('');
            }}
          >
            OK
          </button>
        </div>
      )}
      {isBig && (
        <>
          <ToolbarButton
            icon={List}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Lista punktowana"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Lista numerowana"
          />
        </>
      )}
      <div className="text-xs text-gray-500 ml-auto">
        {charCount}/{limit}
      </div>
    </div>
  );
}
