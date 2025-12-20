import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { EditButtonsProps } from '@/app/admin/admin-types';

export function EditButtons({
  isEditing,
  setIsEditing,
  handleSave,
  handleCancel,
}: EditButtonsProps) {
  return (
    <div className="flex justify-end gap-3">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="p-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition-colors"
          aria-label="Edit"
          type="button"
        >
          <Pencil className="w-6 h-6" />
        </button>
      ) : (
        <div className="flex gap-3 justify-end">
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
  );
}
