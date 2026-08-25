'use client';
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import { EditableDataFieldProps } from '@/cms/content/content-types';

export function EditableDataField({
  value,
  setValue,
  contentLength,
  isEditing,
  fieldName,
  testId,
}: EditableDataFieldProps) {
  const [internalValue, setInternalValue] = useState(value || '{}');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (val: string) => {
    if (contentLength && val.length > contentLength) return;
    setInternalValue(val);
    setValue(val);
    if (error) setError(null);
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(internalValue), null, 2);
      setInternalValue(formatted);
      setValue(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBlur = () => {
    if (!internalValue.trim()) {
      setError(null);
      return;
    }
    handleFormat();
  };

  return (
    <div data-testid={testId} className="flex-1 min-w-0 pr-4 space-y-2">
      <div className="flex justify-between text-xs">
        <h2 className="flex items-center gap-2">
          <span className="underline">{fieldName}</span>
          {isEditing && (
            <span className="text-gray-400">Alt+Shift+F to format</span>
          )}
        </h2>
        {isEditing && (
          <div className="text-gray-500">
            {internalValue.length}/{contentLength}
          </div>
        )}
      </div>
      {isEditing ? (
        <>
          <div
            className="border rounded border-gray-300 p-2"
            onKeyDown={(e) => {
              if (e.altKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                handleFormat();
              }
            }}
          >
            <Editor
              value={internalValue}
              onValueChange={handleChange}
              onBlur={handleBlur}
              highlight={(code) => highlight(code, languages.json, 'json')}
              padding={10}
              textareaClassName="outline-none"
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                minHeight: 150,
                overflow: 'auto',
                backgroundColor: 'transparent',
              }}
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">JSON error: {error}</p>
          )}
        </>
      ) : (
        <pre className="p-2 border rounded text-sm overflow-x-auto">
          {internalValue}
        </pre>
      )}
    </div>
  );
}
