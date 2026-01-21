'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  getContentById,
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
import { MoveCardButtons } from '@/app/admin/content-util/atomic/MoveCardButtons';

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
  moveCard,
}: ContentCardProps) {
  const { data, mutate } = useSWR<Content | null>(
    ['content', content.id],
    async (): Promise<Content | null> => getContentById(content.id),
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

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(safeData.title ?? '');
      setDraftHeader(safeData.header ?? '');
      setDraftDescription(safeData.description ?? '');
    }
  }, [safeData.title, safeData.header, safeData.description, isEditing]);

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
        cursor: isEditing ? 'auto' : 'grab',
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

  const stripEmptyHtml = (html?: string | null): string => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();

    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    return textContent.trim() === '' ? '' : html.trim();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setIsClosing(true);

      const payload = {
        title: stripEmptyHtml(draftTitle),
        header: stripEmptyHtml(draftHeader),
        description: stripEmptyHtml(draftDescription),
      };

      if (upsertById) {
        await updateContent(content.id, payload);
      } else {
        await upsertContent(contentKey, payload);
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
    <div className="w-full max-w-[1280px]">
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
        ${isEditing && !isClosing ? 'fixed z-50 m-auto w-full items-center inset-0 h-fit content-card-animate' : ''}
        ${isClosing ? 'fixed z-50 m-auto w-full items-center inset-0 h-fit transition-all duration-200 scale-95' : ''}`}
        ref={combinedRef}
        style={sortableStyle}
        {...(sortable && !isEditing ? attributes : {})}
        {...(sortable && !isEditing ? listeners : {})}
        aria-describedby={undefined}
      >
        <Card
          className={`flex flex-col justify-between bg-background p-6 relative overflow-x-hidden shadow-lg ${isEditing ? 'w-full max-w-[1000px] max-h-[90vh]' : `min-w-[300px] "md:min-w-[600px]" ${hoverable && 'w-[600px]'} max-w-full h-[350px]`} ${hoverable && !isEditing && 'hover:scale-99 active:scale-99 transition-transform duration-200'}`}
          key={isEditing ? 'editing' : 'view'}
        >
          <p className="absolute right-4 underline">
            {(content.order ?? 0) + 1}
          </p>
          <div className="space-y-6">
            {isTitle && (
              <EditableField
                value={draftTitle}
                setValue={setDraftTitle}
                type="small"
                contentLength={100}
                isEditing={isEditing}
                header={'Title'}
              />
            )}
            {isHeader && (
              <EditableField
                value={draftHeader}
                setValue={setDraftHeader}
                type="small"
                contentLength={100}
                isEditing={isEditing}
                header={'Header'}
              />
            )}
            {isDescription && (
              <EditableField
                value={draftDescription}
                setValue={setDraftDescription}
                type="big"
                contentLength={500}
                isEditing={isEditing}
                header={'Description'}
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
        {contentKeyHeader === false && (
          <div
            className={`flex justify-between ${isEditing && 'justify-center mt-1'}`}
          >
            {onDelete && (
              <DeleteCardButton onDelete={onDelete} contentId={content.id} />
            )}
            {moveCard && !isEditing && (
              <MoveCardButtons contentId={content.id} moveCard={moveCard} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
