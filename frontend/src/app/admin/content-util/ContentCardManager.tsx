'use client';
import React, { useEffect, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  createContent,
  getContents,
  reorderContents,
} from '@/lib/graphql/contentService';
import { ContentCardManagerProps } from '@/app/admin/admin-types';
import { toast } from 'sonner';
import { ContentCard } from '@/app/admin/content-util/ContentCard';
import useSWR from 'swr';
import { Content } from '@/lib/graphql/graphql-types';
import { AddCardButton } from '@/app/admin/content-util/atomic/AddCardButton';

export function ContentCardManager({
  contents: initialContents,
  contentKey,
  mode,
  fields,
}: ContentCardManagerProps) {
  const { data, mutate } = useSWR<Content[]>(
    ['contents', contentKey],
    async (): Promise<Content[]> => getContents(contentKey),
    {
      fallbackData: initialContents,
      revalidateOnFocus: false,
    },
  );
  const contents = data ?? initialContents;
  const [items, setItems] = useState(contents);

  useEffect(() => {
    setItems(contents);
  }, [contents]);

  const handleRevalidate = async () => {
    await mutate();

    await fetch('/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ tag: contentKey }),
    });
  };

  const singleMode = mode === 'single';
  const hasContent = contents.length > 0;
  const canAddContent = mode === 'multiple' || !hasContent;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleAdd = async () => {
    if (!canAddContent) return;
    const newContent = await createContent(contentKey, {
      title: '',
      header: '',
      description: '',
    });
    if (newContent) {
      await handleRevalidate();
      toast.success('Nowa treść została dodana ✅');
    }
  };

  const handleReorder = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((c) => c.id === active.id);
      const newIndex = items.findIndex((c) => c.id === over.id);
      const newItems = arrayMoveImmutable(items, oldIndex, newIndex);

      setItems(newItems);
      await reorderContents(
        contentKey,
        newItems.map((c) => c.id),
      );
      await handleRevalidate();
      toast.success('Zmieniono kolejność treści ➡️');
    }
  };

  const handleReorderMobile = async (
    id: string,
    direction: 'left' | 'right',
  ) => {
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) return;
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = arrayMoveImmutable(items, index, newIndex);

    setItems(newItems);
    await reorderContents(
      contentKey,
      newItems.map((c) => c.id),
    );
    await handleRevalidate();
    toast.success('Zmieniono kolejność treści ➡️');
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px]">
      <AddCardButton
        contentKey={contentKey}
        isAvailable={canAddContent}
        handleAdd={handleAdd}
        singleMode={singleMode}
      />
      {singleMode ? (
        <div className="w-full max-w-[1280px] min-h-[350px]">
          {hasContent && (
            <ContentCard
              content={contents[0]}
              contentKey={contentKey}
              singleMode={true}
              fields={fields}
              handleRevalidate={handleRevalidate}
              handleReorderMobile={handleReorderMobile}
            />
          )}
        </div>
      ) : (
        items.length > 0 && (
          <DndContext sensors={sensors} onDragEnd={handleReorder}>
            <SortableContext
              items={items.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 overflow-x-auto overflow-y-hidden py-3">
                {items.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    contentKey={contentKey}
                    singleMode={false}
                    fields={fields}
                    handleRevalidate={handleRevalidate}
                    handleReorderMobile={handleReorderMobile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )
      )}
    </div>
  );
}
