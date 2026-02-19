import React from 'react';
import { EditPopupUtilProps } from '@/cms/content/content-types';

/**
 * Renders two elements when a card enters edit mode:
 * - a full-screen dark overlay (backdrop)
 * - a placeholder div matching the card's original dimensions,
 *   preventing layout shift when the card becomes position:fixed
 */
export function EditPopupUtil({
  isEditing,
  placeholderHeight,
  placeholderWidth,
}: EditPopupUtilProps) {
  return (
    <>
      {isEditing && <div className="fixed bg-black/50 inset-0 z-45" />}
      {isEditing && placeholderHeight && placeholderWidth && (
        <div
          style={{
            height: placeholderHeight,
            width: placeholderWidth,
          }}
        />
      )}
    </>
  );
}
