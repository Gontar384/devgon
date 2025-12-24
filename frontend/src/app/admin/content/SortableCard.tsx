'use client';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/app/admin/content/ContentCard';
import { useSortable } from '@dnd-kit/sortable';
import { SortableCardProps } from '@/app/admin/admin-types';
import { useState } from 'react';

export function SortableCard({
  content,
  contentKey,
  isTitle,
  isDescription,
  isHeader,
  onDelete,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: content.id });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-describedby={undefined} //hydration mismatch error occurred
    >
      <ContentCard
        content={content}
        contentKey={contentKey}
        isTitle={isTitle}
        isHeader={isHeader}
        isDescription={isDescription}
        contentKeyHeader={false}
        hoverable={true}
        upsertById={true}
      />
      <div className="flex justify-center mt-2 gap-2">
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
          <div className="flex gap-2 items-center">
            <span>Czy jesteś pewny?</span>
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
              onClick={() => onDelete(content.id)}
            >
              Potwierdź
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
