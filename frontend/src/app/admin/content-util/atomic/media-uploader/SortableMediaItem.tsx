import { MediaItem } from '@/app/admin/admin-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Media, MediaType } from '@/lib/graphql/graphql-types';
import Image from 'next/image';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';

export function SortableMediaItem({
  item,
  onDelete,
  isEditing,
}: {
  item: MediaItem;
  onDelete: () => void;
  isEditing: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isEditing });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isExisting = item.type === 'existing';
  const media = isExisting ? (item.data as Media) : null;
  const file = !isExisting ? (item.data as File) : null;

  // Create preview URL for new files
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(url);

      // Cleanup: revoke URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // Determine if it's an image or video
  const isImage = isExisting
    ? media?.type === MediaType.IMAGE
    : file?.type.startsWith('image/');

  const isVideo = isExisting
    ? media?.type === MediaType.VIDEO
    : file?.type.startsWith('video/');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square group"
    >
      {/* Existing media from server */}
      {isExisting && media ? (
        <div>
          {media.type === MediaType.IMAGE ? (
            <Image
              src={media.url}
              alt={media.alt || media.filename}
              fill
              unoptimized
              className="object-cover rounded"
            />
          ) : (
            <video
              src={media.url}
              className="w-full h-full rounded object-cover"
              muted
            />
          )}
        </div>
      ) : null}

      {/* New files from user's computer */}
      {!isExisting && file && previewUrl ? (
        <div>
          {isImage ? (
            <Image
              src={previewUrl}
              alt={file.name}
              fill
              unoptimized
              className="object-cover rounded"
            />
          ) : isVideo ? (
            <video
              src={previewUrl}
              className="w-full h-full rounded object-cover"
              muted
            />
          ) : (
            // Fallback for other file types
            <div className="w-full h-full border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
              <div className="p-2 text-xs truncate text-center">
                {file.name}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Drag handle and delete button */}
      {isEditing && (
        <>
          <div
            {...attributes}
            {...listeners}
            className="absolute top-1 left-1 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <GripVertical className="w-4 h-4 text-white" />
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-7 w-7 p-0"
            onClick={onDelete}
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Optional: Show "new" badge for files not yet uploaded */}
      {!isExisting && (
        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Nowy
        </div>
      )}
    </div>
  );
}
