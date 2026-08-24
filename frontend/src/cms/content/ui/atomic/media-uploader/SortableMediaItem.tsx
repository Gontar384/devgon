import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  CircleChevronUp,
  GripVertical,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import {
  Media,
  MediaType,
  SortableMediaItemProps,
} from '@/cms/content/content-types';

/**
 * Single draggable media item within MediaUploader.
 * Renders a preview for both existing (URL-based) and new (object URL) media.
 * Exposes delete and directional move controls, visible on hover (or always on mobile).
 */
export function SortableMediaItem({
  item,
  onDelete,
  isEditing,
  move,
  canReorder,
}: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isEditing || !canReorder });

  const { isMobile } = useDeviceStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isExisting = item.type === 'existing';
  const media = isExisting ? (item.data as Media) : null;
  const file = item.type === 'new' ? item.data.file : null;
  const previewUrl = item.type === 'new' ? item.data.previewUrl : null;

  const isImage = isExisting
    ? media?.type === MediaType.IMAGE
    : file?.type.startsWith('image/');

  const isVideo = isExisting
    ? media?.type === MediaType.VIDEO
    : file?.type.startsWith('video/');

  return (
    <div
      data-testid="media-item"
      ref={setNodeRef}
      style={style}
      className="relative aspect-square group w-[300px] h-[300px]"
    >
      {isExisting && media ? (
        <div className="relative w-full h-full overflow-hidden">
          {media.type === MediaType.IMAGE ? (
            <Image
              src={media.url}
              alt={media.alt || media.filename}
              fill
              unoptimized
              className="w-full h-full object-cover rounded"
            />
          ) : media.type === MediaType.VIDEO ? (
            <video
              src={media.url}
              className="w-full h-full object-cover rounded"
              autoPlay
              loop
              muted
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
              <div className="p-2 text-xs truncate text-center">
                {media.filename}
              </div>
            </div>
          )}
        </div>
      ) : null}
      {!isExisting && file && previewUrl ? (
        <div className="relative w-full h-full overflow-hidden">
          {isImage ? (
            <Image
              src={previewUrl}
              alt={file.name}
              fill
              unoptimized
              className="w-full h-full object-cover rounded"
            />
          ) : isVideo ? (
            <video
              src={previewUrl}
              className="w-full h-full object-cover rounded"
              autoPlay
              loop
              muted
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
              <div className="p-2 text-xs truncate text-center">
                {file.name}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {isEditing && canReorder && (
        <>
          <div
            {...attributes}
            {...listeners}
            className="absolute top-1 left-1 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <GripVertical className="w-4 h-4 text-white" />
          </div>
          <div
            className={`absolute bottom-6 left-1 flex gap-1 ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''}`}
          >
            <button
              onClick={() => move(item.id, -1)}
              className="p-1 hover:bg-gray-100 hover:cursor-pointer active:bg-gray-100 rounded-full transition-colors"
              aria-label="Move left"
              type="button"
            >
              {isMobile ? (
                <CircleChevronUp className="w-7 h-7" />
              ) : (
                <CircleChevronLeft className="w-7 h-7" />
              )}
            </button>
            <button
              onClick={() => move(item.id, 1)}
              className="p-1 hover:bg-gray-100 hover:cursor-pointer active:bg-gray-100 rounded-full transition-colors"
              aria-label="Move right"
              type="button"
            >
              {isMobile ? (
                <CircleChevronDown className="w-7 h-7" />
              ) : (
                <CircleChevronRight className="w-7 h-7" />
              )}
            </button>
          </div>
        </>
      )}
      {isEditing && (
        <Button
          data-testid="media-remove-button"
          size="sm"
          variant="destructive"
          className={`absolute top-1 right-1 ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''} hover:cursor-pointer transition-opacity z-10 h-7 w-7 p-0`}
          onClick={onDelete}
          type="button"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      {isExisting && media && (
        <div
          className={`absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-2 py-1 truncate rounded-b
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity z-10`}
        >
          {media.filename}
        </div>
      )}
      {!isExisting && file && (
        <div
          className={`absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-2 py-1 truncate rounded-b
                ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity z-10`}
        >
          {file.name}
        </div>
      )}
      {!isExisting && (
        <div
          className={`absolute bottom-7 right-1 bg-gray-300 text-black text-xs px-2 py-1 rounded ${!isMobile ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}
        >
          New
        </div>
      )}
    </div>
  );
}
