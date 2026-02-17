import React from 'react';
import { EditPopupUtilProps } from '@/content/content-types';

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
