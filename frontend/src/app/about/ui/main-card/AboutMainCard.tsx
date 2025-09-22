import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { AboutMainCardProps } from '@/app/about/util/types';
import { Pencil } from 'lucide-react';

export function AboutMainCard({
  title,
  description,
  editable,
  role,
  onSave,
}: AboutMainCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  const canEdit = editable && role === 'admin';

  const handleSave = () => {
    if (onSave) {
      onSave(localTitle, localDescription);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTitle(title);
    setLocalDescription(description);
    setIsEditing(false);
  };

  return (
    <Card
      className="card-animate bg-background/95 backdrop-blur border shadow-xl wrap-break-word relative overflow-hidden"
      aria-label={title}
    >
      <CursorGlow />

      <CardHeader className="flex items-center justify-between">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 w-full max-w-xs"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            maxLength={50}
          />
        ) : (
          <CardTitle>{localTitle}</CardTitle>
        )}

        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 p-1 hover:bg-gray-200 rounded"
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <textarea
            className="border rounded px-2 py-1 w-full max-w-full resize-none"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            rows={4}
            maxLength={200}
          />
        ) : (
          localDescription
        )}
        {isEditing && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
