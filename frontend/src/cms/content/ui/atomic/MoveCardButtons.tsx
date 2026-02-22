import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import React from 'react';
import { MoveCardButtonsProps } from '@/cms/content/content-types';

export function MoveCardButtons({
  handleReorderMobile,
  contentId,
}: MoveCardButtonsProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        data-testid="move-card-left"
        onClick={() => handleReorderMobile(contentId, 'left')}
        className="p-1 hover:bg-gray-100 hover:cursor-pointer active:bg-gray-100 rounded-full transition-colors"
        aria-label="Move left"
        type="button"
      >
        <CircleChevronLeft className="w-7 h-7" />
      </button>
      <button
        data-testid="move-card-right"
        onClick={() => handleReorderMobile(contentId, 'right')}
        className="p-1 hover:bg-gray-100 hover:cursor-pointer active:bg-gray-100 rounded-full transition-colors"
        aria-label="Move right"
        type="button"
      >
        <CircleChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
}
