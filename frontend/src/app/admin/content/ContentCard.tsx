'use client';
import React, { useState } from 'react';
import { CursorGlow } from '@/app/home/ui/parts/CursorGlow';
import { Card } from '@/components/ui/card';
import { getContent, upsertContent } from '@/lib/graphql/contentService';
import { EditButtons } from '@/app/admin/content/EditButtons';
import { EditableField } from '@/app/admin/content/EditableField';
import { ContentCardProps } from '@/app/admin/admin-types';
import useSWR from 'swr';
import { Content } from '@/lib/graphql/graphql-types';

export function ContentCard({ content }: ContentCardProps) {
  const { data, mutate } = useSWR<Content | null>(
    ['content', content.key],
    async (): Promise<Content | null> => getContent(content.key),
    {
      fallbackData: content,
      revalidateOnFocus: false,
    },
  );

  const safeData = data ?? content;

  const [isEditing, setIsEditing] = useState(false);

  const [draftTitle, setDraftTitle] = useState(safeData.title ?? '');
  const [draftHeader, setDraftHeader] = useState(safeData.header ?? '');
  const [draftDescription, setDraftDescription] = useState(
    safeData.description ?? '',
  );

  const handleCancel = () => {
    setDraftTitle(safeData.title ?? '');
    setDraftHeader(safeData.header ?? '');
    setDraftDescription(safeData.description ?? '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      await upsertContent(safeData.key, {
        title: draftTitle,
        header: draftHeader,
        description: draftDescription,
      });

      await mutate();

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ tag: safeData.key }),
      });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (!safeData) return null;

  return (
    <Card className="bg-background/95 backdrop-blur relative overflow-hidden shadow-xl">
      <CursorGlow />
      <div className="p-6">
        <div className="underline">{safeData.key}</div>
        <div className="space-y-6 my-12">
          {safeData.title && (
            <EditableField
              value={draftTitle}
              setValue={setDraftTitle}
              type="small"
              contentLength={100}
              isEditing={isEditing}
            />
          )}
          {safeData.header && (
            <EditableField
              value={draftHeader}
              setValue={setDraftHeader}
              type="small"
              contentLength={100}
              isEditing={isEditing}
            />
          )}
          {safeData.description && (
            <EditableField
              value={draftDescription}
              setValue={setDraftDescription}
              type="big"
              contentLength={500}
              isEditing={isEditing}
            />
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="underline">
            {`Ostatnia edycja: ${new Date(safeData.updatedAt).toLocaleString(
              'pl-PL',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              },
            )}`}
          </div>
          <EditButtons
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        </div>
      </div>
    </Card>
  );
}
