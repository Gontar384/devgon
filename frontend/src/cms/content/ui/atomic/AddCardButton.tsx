import { Button } from '@/components/ui/button';
import React from 'react';
import { AddCardButtonProps } from '@/cms/content/content-types';

export function AddCardButton({
  contentKey,
  isAvailable,
  handleAdd,
  singleMode,
}: AddCardButtonProps) {
  return (
    <div
      className={`flex flex-row gap-4 items-center ${singleMode ? 'mb-4' : 'mb-2'}`}
    >
      <h1 className="underline">{contentKey}</h1>
      <Button
        data-testid="add-card-button"
        onClick={handleAdd}
        disabled={!isAvailable}
        variant="default"
        className="hover:bg-primary hover:scale-105 active:bg-primary active:scale-105 cursor-pointer w-fit"
      >
        Dodaj
      </Button>
    </div>
  );
}
