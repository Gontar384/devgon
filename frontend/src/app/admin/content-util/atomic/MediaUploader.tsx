'use client';
import React, { useState } from 'react';
import { Media } from '@/lib/graphql/graphql-types';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

interface MediaUploaderProps {
  media: Media[];
  onMediaChange: (params: {
    newFiles: File[];
    existingIds: string[];
    deleteIds: string[];
  }) => void;
  isEditing: boolean;
}

export function MediaUploader({
  media,
  onMediaChange,
  isEditing,
}: MediaUploaderProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);

    const existingIds = media
      .filter((m) => !deletedIds.has(m.id))
      .map((m) => m.id);
    onMediaChange({
      newFiles: [...newFiles, ...files],
      existingIds,
      deleteIds: Array.from(deletedIds),
    });
  };

  const handleDeleteExisting = (id: string) => {
    setDeletedIds((prev) => new Set(prev).add(id));

    const existingIds = media
      .filter((m) => !deletedIds.has(m.id) && m.id !== id)
      .map((m) => m.id);
    onMediaChange({
      newFiles,
      existingIds,
      deleteIds: [...Array.from(deletedIds), id],
    });
  };

  const handleDeleteNew = (index: number) => {
    const updated = newFiles.filter((_, i) => i !== index);
    setNewFiles(updated);

    const existingIds = media
      .filter((m) => !deletedIds.has(m.id))
      .map((m) => m.id);
    onMediaChange({
      newFiles: updated,
      existingIds,
      deleteIds: Array.from(deletedIds),
    });
  };

  if (!isEditing) {
    // View mode - pokazuj tylko istniejące media
    return (
      <div className="grid grid-cols-3 gap-2">
        {media.map((m) => (
          <div key={m.id} className="relative aspect-square">
            {m.type === 'image' ? (
              <Image
                src={m.url}
                alt={m.alt || m.filename}
                fill
                className="object-cover rounded"
              />
            ) : (
              <video src={m.url} className="w-full h-full rounded" controls />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4">
      {/* Istniejące media */}
      {media.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div
              key={m.id}
              className={`relative aspect-square ${
                deletedIds.has(m.id) ? 'opacity-30' : ''
              }`}
            >
              {m.type === 'image' ? (
                <Image
                  src={m.url}
                  alt={m.alt || m.filename}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <video src={m.url} className="w-full h-full rounded" />
              )}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1"
                onClick={() => handleDeleteExisting(m.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Nowe pliki (preview) */}
      {newFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {newFiles.map((file, i) => (
            <div
              key={i}
              className="relative aspect-square border-2 border-dashed"
            >
              <div className="p-2 text-xs truncate">{file.name}</div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1"
                onClick={() => handleDeleteNew(i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />
        <label htmlFor="media-upload">
          <Button asChild variant="outline">
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Dodaj media
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
