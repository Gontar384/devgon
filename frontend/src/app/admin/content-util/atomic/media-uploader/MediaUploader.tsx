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
import { toast } from 'sonner';

const ALLOWED = ['image/', 'video/'];

export function MediaUploader({
  media,
  onMediaChange,
  isEditing,
  maxMedia,
}: MediaUploaderProps) {
  const [items, setItems] = useState<MediaItem[]>(() =>
    media.map((m) => ({ id: m.id, type: 'existing', data: m })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const filterValidFiles = (files: File[]) => {
    const valid = files.filter((f) =>
      ALLOWED.some((t) => f.type.startsWith(t)),
    );
    if (valid.length !== files.length) {
      toast.warning('Dozwolone są tylko zdjęcia i wideo');
    }
    return valid;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    files = filterValidFiles(files);

    if (maxMedia && items.length + files.length > maxMedia) {
      toast.warning(`Maksymalna liczba mediów to ${maxMedia}`);
      return;
    }

    const newItems: MediaItem[] = files.map((file) => ({
      id: `new-${crypto.randomUUID()}`,
      type: 'new',
      data: {
        file,
        previewUrl: URL.createObjectURL(file),
      },
    }));

    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);

    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    setItems((items) => {
      const item = items.find((i) => i.id === id);
      if (item?.type === 'new') {
        URL.revokeObjectURL(item.data.previewUrl);
      }
      return items.filter((i) => i.id !== id);
    });
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    setItems((items) => {
      const i = items.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= items.length) return items;
      return arrayMove(items, i, j);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    setItems(reorderedItems);
  };

  const emitChange = (current: MediaItem[]) => {
    const newFiles = current
      .filter((i) => i.type === 'new')
      .map((i) => i.data.file);

    const existingIds = current
      .filter((i) => i.type === 'existing')
      .map((i) => i.id);

    const deleteIds = media
      .filter((m) => !existingIds.includes(m.id))
      .map((m) => m.id);

    onMediaChange({ newFiles, existingIds, deleteIds });
  };

  const canAddMore = !maxMedia || items.length < maxMedia;

  useEffect(() => {
    emitChange(items);
  }, [items]);

  if (!isEditing) {
    return (
      <div className="gap-0 space-y-2">
        <h2 className="text-xs underline">Media</h2>
        <div className="flex flex-wrap gap-2">
          {media.length > 0 ? (
            media.map((m) => (
              <div
                key={m.id}
                className="relative aspect-square group w-[295px] h-[295px]"
              >
                <div className="relative w-full h-full overflow-hidden">
                  {m.type === MediaType.IMAGE ? (
                    <Image
                      src={m.url}
                      alt={m.alt || m.filename}
                      fill
                      unoptimized
                      className="w-full h-full object-cover rounded"
                    />
                  ) : m.type === MediaType.VIDEO ? (
                    <video
                      src={m.url}
                      className="w-full h-full object-cover rounded"
                      controls
                    />
                  ) : null}
                </div>
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
    <div className="gap-0 space-y-2">
      <h2 className="text-xs underline">Media</h2>
      <div className="p-2 border rounded border-gray-300">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <SortableMediaItem
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                  isEditing={isEditing}
                  move={moveItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex items-center justify-center p-5 gap-2">
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
            <Button
              asChild
              variant="outline"
              className="hover:cursor-pointer"
              disabled={!canAddMore}
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Dodaj media
                {maxMedia && ` (${items.length}/${maxMedia})`}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
