'use client';
import React from 'react';
import useSWR from 'swr';
import { AboutMainCard } from '@/app/about/ui/main-card/AboutMainCard';
import { getContent, upsertContent } from '@/app/about/util/graphqlUtil';
import { AboutManagerProps } from '@/app/about/util/types';

const fetcher = (key: string) => getContent(key);

export function AboutManager({ mainCardContent, authUser }: AboutManagerProps) {
  const { data: content, mutate } = useSWR(mainCardContent.key, fetcher, {
    fallbackData: mainCardContent,
    revalidateOnFocus: true,
  });

  const handleSave = async (title: string, description: string) => {
    if (!content) return;
    mutate({ ...content, title, description }, false);

    try {
      const updated = await upsertContent(content.key, { title, description });
      if (updated) {
        mutate();
      }
    } catch (err) {
      console.error('Update failed:', err);
      mutate(content, false);
    }
  };

  if (!content) return null;

  return (
    <section className="w-full min-h-screen relative">
      <div className="flex flex-col items-center px-2">
        <h1 className="text-4xl font-extrabold text-center pt-10 pb-4">
          O nas
        </h1>
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
