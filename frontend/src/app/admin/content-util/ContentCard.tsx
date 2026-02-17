'use client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Card } from '@/components/ui/card';
import { deleteContent, updateContent } from '@/lib/graphql/contentService';
import { EditButtons } from '@/app/admin/content-util/atomic/EditButtons';
import { EditableField } from '@/app/admin/content-util/atomic/EditableField';
import { ContentCardProps, MediaItem } from '@/app/admin/admin-types';
import { toast } from 'sonner';
import { DeleteCardButton } from '@/app/admin/content-util/atomic/DeleteCardButton';
import { useSortable } from '@dnd-kit/sortable';
import { EditPopupUtil } from '@/app/admin/content-util/atomic/EditPopupUtil';
import { MoveCardButtons } from '@/app/admin/content-util/atomic/MoveCardButtons';
import { MediaUploader } from '@/app/admin/content-util/atomic/media-uploader/MediaUploader';

export function ContentCard({
  content,
  singleMode,
  fields,
  handleRevalidate,
  handleReorderMobile,
  maxMedia,
}: ContentCardProps) {
  const safeData = content ?? {};
  const [draftTitle, setDraftTitle] = useState(safeData.title ?? '');
  const [draftHeader, setDraftHeader] = useState(safeData.header ?? '');
  const [draftDescription, setDraftDescription] = useState(
    safeData.description ?? '',
  );

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() =>
    (content?.media || []).map<MediaItem>((m) => ({
      id: m.id,
      type: 'existing',
      data: m,
    })),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(safeData.title ?? '');
      setDraftHeader(safeData.header ?? '');
      setDraftDescription(safeData.description ?? '');

      setMediaItems(
        (content?.media || []).map<MediaItem>((m) => ({
          id: m.id,
          type: 'existing',
          data: m,
        })),
      );
    }
  }, [
    safeData.title,
    safeData.header,
    safeData.description,
    content?.media,
    isEditing,
  ]);

  const handleMediaChange = useCallback((items: MediaItem[]) => {
    setMediaItems(items);
  }, []);

  const closeEditor = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsEditing(false);
    }, 200);
  };

  const handleCancel = () => {
    setDraftTitle(safeData.title ?? '');
    setDraftHeader(safeData.header ?? '');
    setDraftDescription(safeData.description ?? '');

    mediaItems.forEach((item) => {
      if (item.type === 'new') {
        URL.revokeObjectURL(item.data.previewUrl);
      }
    });
    setMediaItems(
      (content?.media || []).map<MediaItem>((m) => ({
        id: m.id,
        type: 'existing',
        data: m,
      })),
    );

    closeEditor();
  };

  const fieldsToDisplay = {
    title: fields.title > 0,
    header: fields.header > 0,
    description: fields.description > 0,
  };

  const sortableHook = useSortable({
    id: content?.id || 'placeholder-id',
    disabled: singleMode || !content?.id || isEditing,
  });
  const { attributes, listeners, setNodeRef, transform, transition } =
    !singleMode
      ? sortableHook
      : {
          attributes: {},
          listeners: {},
          setNodeRef: () => {},
          transform: null,
          transition: undefined,
        };
  const sortableStyle = !singleMode
    ? {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        cursor: isEditing ? 'auto' : 'grab',
      }
    : {};

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [placeholderDimensions, setPlaceholderDimensions] = useState<
    [number, number] | null
  >(null);
  const combinedRef = (node: HTMLDivElement | null) => {
    cardRef.current = node;
    if (!singleMode) {
      setNodeRef(node);
    }
  };

  useLayoutEffect(() => {
    if (!isEditing && cardRef.current) {
      setPlaceholderDimensions([
        cardRef.current.offsetHeight,
        cardRef.current.offsetWidth,
      ]);
    }
  }, [isEditing]);

  const stripEmptyHtml = (html?: string | null): string => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();

    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    return textContent.trim() === '' ? '' : html.trim();
  };

  const handleSave = async () => {
    if (!content) return;
    setIsLoading(true);
    setIsClosing(true);

    const payload = {
      title: stripEmptyHtml(draftTitle),
      header: stripEmptyHtml(draftHeader),
      description: stripEmptyHtml(draftDescription),
      mediaItems,
    };
    try {
      await updateContent(content.id, payload, maxMedia);
      await handleRevalidate();
      toast.success('Treść została edytowana ✏️');
    } catch (err) {
      toast.error('Coś poszło nie tak... ⚙️');
      console.error('Update failed:', err);
    } finally {
      setIsLoading(false);
      closeEditor();
    }
  };

  const handleDelete = async (id: string) => {
    if (!content) return;
    try {
      await deleteContent(id);
      await handleRevalidate();
      toast.success('Wybrana treść została usunięta ❌');
    } catch (err) {
      toast.error('Coś poszło nie tak... ⚙️');
      console.error('Delete failed:', err);
    }
  };

  return content ? (
    <>
      <EditPopupUtil
        isEditing={isEditing}
        placeholderHeight={placeholderDimensions?.[0] ?? 0}
        placeholderWidth={placeholderDimensions?.[1] ?? 0}
      />
      <div
        className={`flex flex-col flex-shrink-0 w-full
        ${isEditing && 'fixed z-50 m-auto items-center inset-0 h-fit content-card-animate'}
        ${isClosing && 'transition-all duration-200 scale-95'} 
        ${!singleMode && !isEditing && 'max-w-[600px]'}`}
        ref={combinedRef}
        style={sortableStyle}
        {...(!singleMode && !isEditing ? attributes : {})}
        {...(!singleMode && !isEditing ? listeners : {})}
        aria-describedby={undefined}
      >
        <Card
          className={`flex flex-col p-0 gap-0 relative overflow-x-hidden bg-background shadow-lg w-full
          ${isEditing ? 'max-w-[1000px] h-[min(80vh,700px)]' : 'h-[450px]'}
           ${!singleMode && !isEditing && 'hover:scale-99 active:scale-99 transition-transform duration-200'}`}
          key={isEditing ? 'editing' : 'view'}
        >
          {!singleMode && (
            <p className="text-sm absolute right-4 top-4 px-1.5 underline border-2 rounded-full">
              {(content?.order ?? 0) + 1}
            </p>
          )}
          <div className="space-y-6 flex-1 overflow-y-auto p-6">
            {fieldsToDisplay.title && (
              <EditableField
                value={draftTitle}
                setValue={setDraftTitle}
                type="small"
                contentLength={fields.title}
                isEditing={isEditing}
                header={'Title'}
              />
            )}
            {fieldsToDisplay.header && (
              <EditableField
                value={draftHeader}
                setValue={setDraftHeader}
                type="small"
                contentLength={fields.header}
                isEditing={isEditing}
                header={'Header'}
              />
            )}
            {fieldsToDisplay.description && (
              <EditableField
                value={draftDescription}
                setValue={setDraftDescription}
                type="big"
                contentLength={fields.description}
                isEditing={isEditing}
                header={'Description'}
              />
            )}
            {(maxMedia ?? 0) > 0 && (
              <MediaUploader
                media={mediaItems || []}
                onMediaChange={handleMediaChange}
                isEditing={isEditing}
                maxMedia={maxMedia}
              />
            )}
          </div>
          <EditButtons
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            updatedAt={safeData.updatedAt}
            isLoading={isLoading}
          />
        </Card>
        <div
          className={`flex justify-between ${isEditing && 'justify-center mt-1 w-full'}`}
        >
          {content && (
            <DeleteCardButton
              handleDelete={handleDelete}
              contentId={content.id}
              isEditing={isEditing}
            />
          )}
          {!singleMode && !isEditing && (
            <MoveCardButtons
              handleReorderMobile={handleReorderMobile}
              contentId={content.id}
            />
          )}
        </div>
      </div>
    </>
  ) : null;
}
