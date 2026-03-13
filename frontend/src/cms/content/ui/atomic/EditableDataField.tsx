'use client';
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import { EditableDataFieldProps } from '@/cms/content/content-types';

export function EditableDataField({
  value,
  setValue,
  isEditing,
  fieldName,
  testId,
}: EditableDataFieldProps) {
  const [internalValue, setInternalValue] = useState(value || '{}');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (val: string) => {
    setInternalValue(val);
    setValue(val);
    if (error) setError(null);
  };

  const handleBlur = () => {
    if (!internalValue.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(internalValue);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div data-testid={testId} className="flex-1 min-w-0 pr-4 space-y-2">
      <h2 className="text-xs underline">{fieldName}</h2>
      {isEditing ? (
        <div className="border rounded border-gray-300 p-2 bg-gray-50">
          <Editor
            value={internalValue}
            onValueChange={handleChange}
            onBlur={handleBlur}
            highlight={(code) => highlight(code, languages.json, 'json')}
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              minHeight: 150,
              overflow: 'auto',
              backgroundColor: 'transparent',
            }}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">Błąd w JSON: {error}</p>
          )}
        </div>
      ) : (
        <pre className="p-2 border rounded bg-gray-100 text-sm overflow-x-auto">
          {internalValue}
        </pre>
      )}
    </div>
  );
}
