import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { EditButtonsProps } from '@/components/admin-content/admin-content-types';

export function EditButtons({
  isEditing,
  setIsEditing,
  handleCancel,
  handleSave,
}: EditButtonsProps) {
  return (
    <div className="pt-4 flex justify-end gap-3">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Edit"
          type="button"
        >
          <Pencil className="w-5 h-5" />
        </button>
      ) : (
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="hover:bg-background hover:scale-105 cursor-pointer"
          >
            Anuluj
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            className="hover:bg-primary hover:scale-105 cursor-pointer"
          >
            Zapisz
          </Button>
        </div>
      )}
    </div>
  );
}
