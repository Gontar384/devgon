'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { MediaItem, MediaUploaderProps } from '@/app/admin/admin-types';
import { SortableMediaItem } from '@/app/admin/content-util/atomic/media-uploader/SortableMediaItem';
import { MediaType } from '@/lib/graphql/graphql-types';

export function MediaUploader({
  media,
  onMediaChange,
  isEditing,
  maxMedia,
}: MediaUploaderProps) {
  console.log(media);
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const existingItems: MediaItem[] = media.map((m) => ({
      id: m.id,
      type: 'existing' as const,
      data: m,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(existingItems);
  }, [media]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (maxMedia && items.length + files.length > maxMedia) {
      alert(`Maksymalna liczba mediów to ${maxMedia}`);
      return;
    }

    const newItems: MediaItem[] = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      type: 'new' as const,
      data: file,
    }));

    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    emitChange(updatedItems);

    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    emitChange(updatedItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    setItems(reorderedItems);
    emitChange(reorderedItems);
  };

  const emitChange = (currentItems: MediaItem[]) => {
    const newFiles = currentItems
      .filter((item) => item.type === 'new')
      .map((item) => item.data as File);

    const existingIds = currentItems
      .filter((item) => item.type === 'existing')
      .map((item) => item.id);

    const currentExistingIds = new Set(existingIds);
    const deleteIds = media
      .filter((m) => !currentExistingIds.has(m.id))
      .map((m) => m.id);

    onMediaChange({ newFiles, existingIds, deleteIds });
  };

  const canAddMore = !maxMedia || items.length < maxMedia;

  if (!isEditing) {
    return (
      <div className="gap-0">
        <h2 className="text-xs underline">Media</h2>
        <div className="grid grid-cols-3 gap-2">
          {media.length > 0 ? (
            media.map((m) => (
              <div key={m.id} className="relative aspect-square">
                {m.type === MediaType.IMAGE ? (
                  <Image
                    src={m.url}
                    alt={m.alt || m.filename}
                    fill
                    unoptimized
                    className="object-cover rounded"
                  />
                ) : (
                  <video
                    src={m.url}
                    className="w-full h-full rounded"
                    controls
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-2xl">{'<...>'}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <SortableMediaItem
                key={item.id}
                item={item}
                onDelete={() => handleDelete(item.id)}
                isEditing={isEditing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
          disabled={!canAddMore}
        />
        <label htmlFor="media-upload">
          <Button asChild variant="outline" disabled={!canAddMore}>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Dodaj media
              {maxMedia && ` (${items.length}/${maxMedia})`}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
