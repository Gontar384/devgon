import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import React from 'react';
import { MoveCardButtonsProps } from '@/app/admin/admin-types';

export function MoveCardButtons({ contentId, moveCard }: MoveCardButtonsProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => moveCard(contentId, 'left')}
        className="p-1 hover:bg-gray-100 hover:cursor-pointer rounded-full transition-colors"
        aria-label="Move left"
        type="button"
      >
        <CircleChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={() => moveCard(contentId, 'right')}
        className="p-1 hover:bg-gray-100 hover:cursor-pointer rounded-full transition-colors"
        aria-label="Move right"
        type="button"
      >
        <CircleChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
}
