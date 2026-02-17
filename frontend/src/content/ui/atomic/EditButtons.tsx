import { Loader2Icon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { EditButtonsProps } from '@/content/content-types';

export function EditButtons({
  isEditing,
  setIsEditing,
  handleSave,
  handleCancel,
  updatedAt,
  isLoading,
}: EditButtonsProps) {
  return (
    <div className="w-full flex justify-between items-center gap-2 text-xs bg-background border-t p-3">
      <div className="underline">
        <p>Ostatnia edycja:</p>
        <p>
          {new Date(updatedAt).toLocaleString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Warsaw',
          })}
        </p>
      </div>
      <div className="flex justify-end gap-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 hover:bg-gray-100 hover:cursor-pointer active:bg-gray-100 rounded-full transition-colors"
            aria-label="Edit"
            type="button"
          >
            <Pencil className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex flex-wrap-reverse justify-center gap-3 ">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="hover:bg-background hover:scale-105 active:bg-background active:scale-105 cursor-pointer"
            >
              Anuluj
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              className="hover:bg-primary hover:scale-105 active:bg-primary active:scale-105 cursor-pointer"
            >
              Zapisz
            </Button>
          </div>
        )}
      </div>
      {isEditing && isLoading && (
        <Loader2Icon className="h-20 w-20 text-primary/70 animate-spin absolute inset-0 m-auto" />
      )}
    </div>
  );
}
