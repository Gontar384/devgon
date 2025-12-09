'use client';
import React, { useState } from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { Card } from '@/components/ui/card';
import { ContentCardProps } from '@/components/admin-content/admin-content-types';
import { upsertContent } from '@/lib/graphql/contentService';
import { EditButtons } from '@/components/admin-content/atomic/EditButtons';
import { EditableField } from '@/components/admin-content/atomic/EditableField';

export function ContentCard({
  id,
  contentKey,
  order,
  createdAt,
  updatedAt,
  title,
  header,
  description,
  images,
  video,
  role,
  mutate,
}: ContentCardProps) {
  const isAdmin = role === 'admin';
  const [isEditing, setIsEditing] = useState(false);

  const [draftTitle, setDraftTitle] = useState(title ?? '');
  const [draftHeader, setDraftHeader] = useState(header ?? '');
  const [draftDescription, setDraftDescription] = useState(description ?? '');

  const handleCancel = () => {
    setDraftTitle(title ?? '');
    setDraftHeader(header ?? '');
    setDraftDescription(description ?? '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      await upsertContent(contentKey!, {
        title: draftTitle,
        header: draftHeader,
        description: draftDescription,
      });

      if (mutate) {
        await mutate();
      }

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ tag: contentKey }),
      });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur relative overflow-hidden shadow-xl">
      <CursorGlow />
      <div className="p-6 space-y-6">
        {title && (
          <EditableField
            value={draftTitle}
            isEditing={isEditing}
            type="small"
            contentLength={100}
            onChange={setDraftTitle}
          />
        )}
        {header && (
          <EditableField
            value={draftHeader}
            isEditing={isEditing}
            type="small"
            contentLength={100}
            onChange={setDraftHeader}
          />
        )}
        {description && (
          <EditableField
            value={draftDescription}
            isEditing={isEditing}
            type="big"
            contentLength={500}
            onChange={setDraftDescription}
          />
        )}
        {isAdmin && (
          <EditButtons
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
        )}
      </div>
    </Card>
  );
}
