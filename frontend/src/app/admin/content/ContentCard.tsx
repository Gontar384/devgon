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

export function ContentCard({
  content,
  contentKey,
  isTitle,
  isDescription,
  isHeader,
}: ContentCardProps) {
  const { data, mutate } = useSWR<Content | null>(
    ['content', contentKey],
    async (): Promise<Content | null> => getContent(contentKey),
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
      await upsertContent(contentKey, {
        title: draftTitle,
        header: draftHeader,
        description: draftDescription,
      });

      await mutate();

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ tag: contentKey }),
      });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <>
      <div className="underline">{contentKey}</div>
      <Card className="bg-background/95 backdrop-blur relative overflow-hidden shadow-xl min-w-[500px]">
        <CursorGlow />
        <div className="p-6">
          <div className="space-y-6 mb-10">
            {isTitle && (
              <EditableField
                value={draftTitle}
                setValue={setDraftTitle}
                type="small"
                contentLength={100}
                isEditing={isEditing}
              />
            )}
            {isHeader && (
              <EditableField
                value={draftHeader}
                setValue={setDraftHeader}
                type="small"
                contentLength={100}
                isEditing={isEditing}
              />
            )}
            {isDescription && (
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
    </>
  );
}
