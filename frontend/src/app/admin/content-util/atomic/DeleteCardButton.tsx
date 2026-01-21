import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { DeleteCardButtonProps } from '@/app/admin/admin-types';

export function DeleteCardButton({
  onDelete,
  contentId,
}: DeleteCardButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex justify-center items-center">
      <div className="rounded-md py-2 px-6 bg-background w-fit">
        {!confirmOpen ? (
          <Button
            variant="destructive"
            size="sm"
            className="hover:scale-105 active:scale-105 cursor-pointer"
            onClick={() => setConfirmOpen(true)}
          >
            Usuń
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 items-center">
            <p>Czy jesteś pewny?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-background hover:scale-105 active:bg-background active:scale-105 cursor-pointer"
                onClick={() => setConfirmOpen(false)}
              >
                Anuluj
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="hover:scale-105 active:scale-105 cursor-pointer"
                onClick={() => onDelete(contentId)}
              >
                Potwierdź
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
