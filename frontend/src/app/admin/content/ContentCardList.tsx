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
import { toast } from 'sonner';

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
      toast.success('Zmieniono kolejność treści ➡️');
    }
  };

  const handleAdd = async () => {
    const newContent = await createContent(contentKey, {
      title: '',
      header: '',
      description: '',
    });
    if (newContent) {
      setItems((prev) => [...prev, newContent]);
      toast.success('Nowa treść została dodana ✅');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteContent(id);
    if (success) {
      setItems((prev) => prev.filter((c) => c.id !== id));
      toast.success('Wybrana treść została usunięta ❌');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-4 items-center">
        <div className="underline">{contentKey}</div>
        <Button
          onClick={handleAdd}
          variant="default"
          className="hover:bg-primary hover:scale-105 active:bg-primary active:scale-105 cursor-pointer w-fit"
        >
          Dodaj nowy
        </Button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden py-3">
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
