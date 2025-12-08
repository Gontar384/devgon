'use client';
import React, { useState } from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorContent } from '@tiptap/react';
import { TiptapToolbar } from '@/components/tiptap/TiptapToolbar';
import { useSmallEditor } from '@/components/tiptap/useSmallEditor';
import { useBigEditor } from '@/components/tiptap/useBigEditor';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AdminMainCardProps } from '@/app/admin/admin-types';

export function AdminAboutMainCard({
  title,
  description,
  role,
  onSave,
}: AdminMainCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const smallEditor = useSmallEditor({
    initialContent: title,
    contentLength: 100,
  });
  const bigEditor = useBigEditor({
    initialContent: description,
    contentLength: 500,
  });

  const canEdit = role === 'admin';

  const handleSave = () => {
    if (onSave && smallEditor && bigEditor) {
      const updatedTitle = smallEditor.getHTML();
      const updatedDescription = bigEditor.getHTML();

      onSave(updatedTitle, updatedDescription);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    smallEditor?.commands.setContent(title);
    bigEditor?.commands.setContent(description);
    setIsEditing(false);
  };

  return (
    <Card
      className="bg-background/95 backdrop-blur wrap-break-word relative overflow-hidden shadow-xl"
      aria-label={title}
    >
      <CursorGlow />




      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0 pr-4">
          {isEditing ? (
            <div className="p-2 border rounded border-gray-300">
              {smallEditor && <TiptapToolbar editor={smallEditor} />}
              {smallEditor && <EditorContent editor={smallEditor} />}
            </div>
          ) : (
            <h2
              className="text-2xl font-semibold break-words"
              dangerouslySetInnerHTML={{ __html: title ?? '' }}
            />
          )}
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Edit"
            type="button"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {isEditing ? (
          <div className="p-2 border rounded border-gray-300 min-h-[150px]">
            {bigEditor && <TiptapToolbar editor={bigEditor} />}
            {bigEditor && <EditorContent editor={bigEditor} />}
          </div>
        ) : (
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description ?? '' }}
          />
        )}
        {isEditing && (
          <div className="mt-6 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="hover:bg-background hover:scale-105 cursor-pointer"
            >
              Anuluj
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              className="hover:bg-primary hover:scale-105 cursor-pointer"
            >
              Zapisz
            </Button>
          </div>
        )}
      </CardContent>





    </Card>
  );
}
