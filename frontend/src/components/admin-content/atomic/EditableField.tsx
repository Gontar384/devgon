import { TiptapToolbar } from '@/components/tiptap/TiptapToolbar';
import { EditorContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useSmallEditor } from '@/components/tiptap/useSmallEditor';
import { useBigEditor } from '@/components/tiptap/useBigEditor';
import { EditableFieldProps } from '@/components/admin-content/admin-content-types';

export function EditableField({
  value,
  isEditing,
  type,
  contentLength,
  onChange,
}: EditableFieldProps) {
  const smallEditor = useSmallEditor({
    initialContent: value,
    contentLength,
    enabled: isEditing && type === 'small',
  });

  const bigEditor = useBigEditor({
    initialContent: value,
    contentLength,
    enabled: isEditing && type === 'big',
  });

  const editor = type === 'small' ? smallEditor : bigEditor;

  useEffect(() => {
    if (!isEditing || !editor) return;

    const handleUpdate = () => onChange(editor.getHTML());

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [isEditing, editor, onChange]);

  return (
    <div className="flex-1 min-w-0 pr-4">
      {isEditing ? (
        <div className="p-2 border rounded border-gray-300">
          {editor && <TiptapToolbar editor={editor} />}
          {editor && <EditorContent editor={editor} />}
        </div>
      ) : (
        <h2
          className="text-2xl font-semibold break-words"
          dangerouslySetInnerHTML={{ __html: value ?? '' }}
        />
      )}
    </div>
  );
}
