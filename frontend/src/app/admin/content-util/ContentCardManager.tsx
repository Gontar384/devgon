'use client';
import React, { useEffect, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
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
import { useDeviceStore } from '@/store/deviceStore';

export function ContentCardManager({
  contents: initialContents,
  contentKey,
  mode,
  fields,
  maxMedia,
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

  const { isMobile } = useDeviceStore();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobile ? { distance: Infinity } : { distance: 5 },
    }),
  );

  const handleAdd = async () => {
    if (!canAddContent) return;
    try {
      const newContent = await createContent(contentKey);
      if (newContent) {
        await handleRevalidate();
        toast.success('Nowa treść została dodana ✅');
      }
    } catch (err) {
      toast.error('Coś poszło nie tak... ⚙️');
      console.error('Create failed:', err);
    }
  };

  const reorderHelper = async (newItems: Content[]) => {
    setItems(newItems);
    try {
      await reorderContents(
        contentKey,
        newItems.map((c) => c.id),
      );
      await handleRevalidate();
      toast.success('Zmieniono kolejność treści ➡️');
    } catch (err) {
      setItems(items);
      toast.error('Coś poszło nie tak... ⚙️');
      console.error('Reorder failed:', err);
    }
  };

  const handleReorder = async (event: DragEndEvent) => {
    if (singleMode) return;
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((c) => c.id === active.id);
      const newIndex = items.findIndex((c) => c.id === over.id);
      const newItems = arrayMoveImmutable(items, oldIndex, newIndex);

      await reorderHelper(newItems);
    }
  };

  const handleReorderMobile = async (
    id: string,
    direction: 'left' | 'right',
  ) => {
    if (singleMode) return;
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) return;
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = arrayMoveImmutable(items, index, newIndex);

    await reorderHelper(newItems);
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
        <div className={`w-full ${!hasContent && 'h-[450px]'}`}>
          {hasContent && (
            <ContentCard
              content={contents[0]}
              singleMode={true}
              fields={fields}
              handleRevalidate={handleRevalidate}
              handleReorderMobile={handleReorderMobile}
              maxMedia={maxMedia}
            />
          )}
        </div>
      ) : (
        <div className={`w-full ${!hasContent && 'h-[450px]'}`}>
          {items.length > 0 && (
            <DndContext
              sensors={sensors}
              onDragEnd={handleReorder}
              modifiers={[restrictToHorizontalAxis]}
            >
              <SortableContext
                items={items.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="w-full flex gap-4 p-1 overflow-x-auto">
                  {items.map((content) => (
                    <div
                      key={content.id}
                      className="flex-shrink-0 max-w-[600px] w-full"
                    >
                      <ContentCard
                        content={content}
                        singleMode={false}
                        fields={fields}
                        handleRevalidate={handleRevalidate}
                        handleReorderMobile={handleReorderMobile}
                        maxMedia={maxMedia}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
}
