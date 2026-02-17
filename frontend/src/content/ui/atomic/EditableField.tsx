import { TiptapToolbar } from '@/content/util/tiptap/TiptapToolbar';
import { EditorContent } from '@tiptap/react';
import React, { useEffect } from 'react';
import { useSmallEditor } from '@/content/util/tiptap/useSmallEditor';
import { useBigEditor } from '@/content/util/tiptap/useBigEditor';
import { EditableFieldProps } from '@/content/content-types';

export function EditableField({
  value,
  setValue,
  type,
  contentLength,
  isEditing,
  header,
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

    const handleUpdate = () => setValue(editor.getHTML());

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [isEditing, editor, setValue]);

  return (
    <div className="flex-1 min-w-0 pr-4 space-y-2">
      <h2 className="text-xs underline">{header}</h2>
      {isEditing ? (
        <div className="p-2 border rounded border-gray-300">
          {editor && <TiptapToolbar editor={editor} />}
          {editor && <EditorContent editor={editor} />}
        </div>
      ) : (
        <h3
          className="text-2xl break-words"
          dangerouslySetInnerHTML={{
            __html: value !== '' ? value : '<...>',
          }}
        />
      )}
    </div>
  );
}
