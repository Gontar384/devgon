'use client';
import React, { useState } from 'react';
import { AboutMainCard } from '@/app/about/ui/main-card/AboutMainCard';
import { upsertContent } from '@/app/about/util/graphqlUtil';
import { AboutManagerProps } from '@/app/about/util/types';

export function AboutManager({ mainCardContent, authUser }: AboutManagerProps) {
  const [content, setContent] = useState(mainCardContent);

  const handleSave = async (title: string, description: string) => {
    if (!content) return;

    const updated = await upsertContent(content.key, { title, description });
    if (updated) {
      setContent({ ...content, ...updated });
    }
  };

  if (!content) return null;

  return (
    <section className="w-full min-h-screen relative">
      <div className="flex flex-col items-center px-2">
        <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
          <AboutMainCard
            title={content.title ?? ''}
            description={content.description ?? ''}
            editable={content.editable}
            role={authUser.role}
            onSave={handleSave}
          />
        </div>
      </div>
    </section>
  );
}
