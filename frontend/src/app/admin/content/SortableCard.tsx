'use client';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/app/admin/content/ContentCard';
import { useSortable } from '@dnd-kit/sortable';
import { SortableCardProps } from '@/app/admin/admin-types';

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
      />
      <div className="flex justify-center mt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(content.id)}
        >
          Usuń
        </Button>
      </div>
    </div>
  );
}
