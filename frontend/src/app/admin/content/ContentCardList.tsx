'use client';
import React, { useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import {
  createContent,
  deleteContent,
  reorderContents,
} from '@/lib/graphql/contentService';
import { SortableCard } from '@/app/admin/content/SortableCard';
import { ContentCardListProps } from '@/app/admin/admin-types';

export function ContentCardList({
  contents,
  contentKey,
  isTitle,
  isHeader,
  isDescription,
}: ContentCardListProps) {
  const [items, setItems] = useState(contents);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = async (event: any) => {
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
    }
  };

  const handleAdd = async () => {
    const newContent = await createContent(contentKey, {
      title: '',
      header: '',
      description: '',
    });
    if (newContent) setItems((prev) => [...prev, newContent]);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteContent(id);
    if (success) setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col items-center w-full px-2">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Dodaj nowy</Button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex space-x-4 overflow-x-auto py-2">
            {items.map((content) => (
              <SortableCard
                key={content.id}
                content={content}
                contentKey={contentKey}
                isTitle={isTitle}
                isHeader={isHeader}
                isDescription={isDescription}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
