'use client';
import React from 'react';
import useSWR from 'swr';
import { AdminAboutMainCard } from '@/app/admin/ui/admin-about/AdminAboutMainCard';
import { getContent, upsertContent } from '@/lib/graphql/graphqlUtil';
import { AdminManagerProps } from '@/app/admin/admin-types';

const fetcher = (key: string) => getContent(key);

export function AdminAbout({ mainCardContent, authUser }: AdminManagerProps) {
  const key = mainCardContent!.key;

  const { data: content, mutate } = useSWR(key, fetcher, {
    fallbackData: mainCardContent,
    revalidateOnFocus: true,
  });

  const handleSave = async (title: string, description: string) => {
    if (!content) return;

    mutate({ ...content, title, description }, false);

    try {
      const updated = await upsertContent(key!, { title, description });

      if (updated) {
        await fetch('/api/revalidate', {
          method: 'POST',
          body: JSON.stringify({ tag: key }),
        });

        await mutate();
      }
    } catch (err) {
      console.error('Update failed:', err);
      mutate();
    }
  };

  if (!content) return null;

  return (
    <div className="flex flex-col items-center px-2">
      <h1 className="sr-only">O nas</h1>
      <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
        <AdminAboutMainCard
          title={content.title ?? ''}
          description={content.description ?? ''}
          role={authUser.role}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
