'use client';
import React from 'react';
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
import { SortableMediaItem } from '@/content/ui/atomic/media-uploader/SortableMediaItem';
import { toast } from 'sonner';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { useDeviceStore } from '@/store/deviceStore';
import {
  Media,
  MediaItem,
  MediaType,
  MediaUploaderProps,
} from '@/content/content-types';

const ALLOWED = ['image/', 'video/'];

/**
 * Media upload and preview area within the content editor.
 * Supports drag-and-drop reordering and directional buttons for mobile.
 * New files are previewed locally via object URLs before upload.
 * Enforces the `maxMedia` limit on the client side before sending to server.
 */
export function MediaUploader({
  media,
  onMediaChange,
  isEditing,
  maxMedia,
}: MediaUploaderProps) {
  const { isMobile } = useDeviceStore();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobile ? { distance: Infinity } : { distance: 5 },
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

    if (maxMedia && media.length + files.length > maxMedia) {
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

    const updatedItems = [...media, ...newItems];
    onMediaChange(updatedItems);

    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    const item = media.find((i) => i.id === id);
    if (item?.type === 'new') {
      URL.revokeObjectURL(item.data.previewUrl);
    }
    const updatedItems = media.filter((i) => i.id !== id);
    onMediaChange(updatedItems);
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    const i = media.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= media.length) return;

    const updatedItems = arrayMove(media, i, j);
    onMediaChange(updatedItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = media.findIndex((item) => item.id === active.id);
    const newIndex = media.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(media, oldIndex, newIndex);
    onMediaChange(reorderedItems);
  };

  const canAddMore = !maxMedia || media.length < maxMedia;

  if (!isEditing) {
    return (
      <div className="gap-0 space-y-2">
        <h2 className="text-xs underline">Media</h2>
        <div className="flex flex-wrap gap-2">
          {media.length > 0 ? (
            media
              .filter(
                (m): m is { id: string; type: 'existing'; data: Media } =>
                  m.type === 'existing',
              )
              .map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-square group w-[235px] h-[235px]"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {m.data.type === MediaType.IMAGE ? (
                      <Image
                        src={m.data.url}
                        alt={m.data.alt || m.data.filename}
                        fill
                        unoptimized
                        className="w-full h-full object-cover rounded"
                      />
                    ) : m.data.type === MediaType.VIDEO ? (
                      <video
                        src={m.data.url}
                        className="w-full h-full object-cover rounded"
                        autoPlay
                        loop
                        muted
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
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={media.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {media.map((item) => (
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
              className={`${!canAddMore ? 'bg-primary hover:bg-primary' : 'hover:cursor-pointer'}`}
              disabled={!canAddMore}
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Dodaj media
                {maxMedia && ` (${media.length}/${maxMedia})`}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
