'use client';
import React, { useLayoutEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  getContent,
  updateContent,
  upsertContent,
} from '@/lib/graphql/contentService';
import { EditButtons } from '@/app/admin/content-util/atomic/EditButtons';
import { EditableField } from '@/app/admin/content-util/atomic/EditableField';
import { ContentCardProps } from '@/app/admin/admin-types';
import useSWR from 'swr';
import { Content } from '@/lib/graphql/graphql-types';
import { toast } from 'sonner';
import { DeleteCardButton } from '@/app/admin/content-util/atomic/DeleteCardButton';
import { useSortable } from '@dnd-kit/sortable';
import { EditPopupUtil } from '@/app/admin/content-util/atomic/EditPopupUtil';

export function ContentCard({
  content,
  contentKey,
  isTitle,
  isDescription,
  isHeader,
  contentKeyHeader,
  hoverable,
  upsertById,
  onDelete,
  sortable,
  sortableId,
}: ContentCardProps) {
  const { data, mutate } = useSWR<Content | null>(
    ['content', contentKey],
    async (): Promise<Content | null> => getContent(contentKey),
    {
      fallbackData: content,
      revalidateOnFocus: false,
    },
  );
  const safeData = data ?? content ?? '';
  const [draftTitle, setDraftTitle] = useState(safeData.title ?? '');
  const [draftHeader, setDraftHeader] = useState(safeData.header ?? '');
  const [draftDescription, setDraftDescription] = useState(
    safeData.description ?? '',
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sortableHook = useSortable({
    id: sortableId || content.id,
    disabled: !sortable,
  });
  const { attributes, listeners, setNodeRef, transform, transition } = sortable
    ? sortableHook
    : {
        attributes: {},
        listeners: {},
        setNodeRef: () => {},
        transform: null,
        transition: undefined,
      };
  const sortableStyle = sortable
    ? {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        cursor: isEditing ? 'default' : 'grab',
      }
    : {};

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [placeholderDimensions, setPlaceholderDimensions] = useState<
    [number, number] | null
  >(null);
  const combinedRef = (node: HTMLDivElement | null) => {
    cardRef.current = node;
    if (sortable) {
      setNodeRef(node);
    }
  };

  useLayoutEffect(() => {
    if (!isEditing && cardRef.current) {
      setPlaceholderDimensions([
        cardRef.current.offsetHeight,
        cardRef.current.offsetWidth,
      ]);
    }
  }, [isEditing]);

  const closeEditor = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsEditing(false);
    }, 200);
  };

  const handleCancel = () => {
    setDraftTitle(safeData.title ?? '');
    setDraftHeader(safeData.header ?? '');
    setDraftDescription(safeData.description ?? '');
    closeEditor();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setIsClosing(true);
      if (upsertById) {
        await updateContent(content.id, {
          title: draftTitle,
          header: draftHeader,
          description: draftDescription,
        });
      } else {
        await upsertContent(contentKey, {
          title: draftTitle,
          header: draftHeader,
          description: draftDescription,
        });
      }

      await mutate();

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ tag: contentKey }),
      });
      toast.success('Treść została edytowana ✏️');
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsLoading(false);
      closeEditor();
    }
  };

  return (
    <div>
      {contentKeyHeader !== false && (
        <div className="underline mb-4">{contentKey}</div>
      )}
      <EditPopupUtil
        isEditing={isEditing}
        placeholderHeight={placeholderDimensions?.[0] ?? 0}
        placeholderWidth={placeholderDimensions?.[1] ?? 0}
      />
      <div
        className={`flex flex-col
        ${isEditing && !isClosing ? 'fixed z-50 m-auto w-fit inset-0 h-fit content-card-animate' : ''}
        ${isClosing ? 'fixed z-50 m-auto w-fit inset-0 h-fit transition-all duration-200 scale-95' : ''}`}
        ref={combinedRef}
        style={sortableStyle}
        {...(sortable && !isEditing ? attributes : {})}
        {...(sortable && !isEditing ? listeners : {})}
        aria-describedby={undefined}
      >
        <Card
          className={`bg-background p-6 backdrop-blur relative overflow-hidden shadow-lg ${hoverable && !isEditing && 'hover:scale-99 active:scale-99 transition-transform duration-200'}`}
        >
          <div className="space-y-6 mb-2">
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
          <EditButtons
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            updatedAt={safeData.updatedAt}
            isLoading={isLoading}
          />
        </Card>
        {onDelete && (
          <DeleteCardButton onDelete={onDelete} contentId={content.id} />
        )}
      </div>
    </div>
  );
}
