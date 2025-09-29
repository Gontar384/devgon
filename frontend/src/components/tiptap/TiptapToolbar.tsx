'use client';
import { Bold, Italic, List, ListOrdered, Underline } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ToolbarButton } from '@/components/tiptap/ToolbarButton';
import { TiptapToolbarProps } from '@/components/tiptap/types';

export function TiptapToolbar({ editor, size }: TiptapToolbarProps) {
  const [, setUpdateCounter] = useState(0);

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

  if (!editor) return null;

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
      {size === 'big' && (
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
    </div>
  );
}
