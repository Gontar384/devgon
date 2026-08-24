import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { DeleteCardButtonProps } from '@/cms/content/content-types';

/**
 * Delete button with a built-in confirmation step.
 * First click reveals confirm/cancel options; second click triggers deletion.
 */
export function DeleteCardButton({
  handleDelete,
  contentId,
  isEditing,
}: DeleteCardButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div
      className={`flex items-center justify-start ${isEditing && 'w-full max-w-[1000px]'}`}
    >
      <div className="rounded-md py-2 px-6 bg-background w-fit">
        {!confirmOpen ? (
          <Button
            data-testid="delete-button"
            variant="destructive"
            size="sm"
            className="hover:scale-105 active:scale-105 cursor-pointer"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 items-center">
            <p>Are you sure?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-background hover:scale-105 active:bg-background active:scale-105 cursor-pointer"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-testid="delete-confirm-button"
                variant="destructive"
                size="sm"
                className="hover:scale-105 active:scale-105 cursor-pointer"
                onClick={() => handleDelete(contentId)}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
