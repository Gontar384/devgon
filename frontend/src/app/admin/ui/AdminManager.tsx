'use client';
import React from 'react';
import useSWR from 'swr';
import { AdminMainCard } from '@/app/admin/ui/AdminMainCard';
import { getContent, upsertContent } from '@/lib/graphql/graphqlUtil';
import { AdminManagerProps } from '@/app/admin/types';

const fetcher = (key: string) => getContent(key);

export function AdminManager({ mainCardContent, authUser }: AdminManagerProps) {
  const key = mainCardContent!.key;

  const { data: content, mutate } = useSWR(key, fetcher, {
    fallbackData: mainCardContent,
    revalidateOnFocus: true,
  });

  const handleSave = async (title: string, description: string) => {
    if (!content) return;

    // optymistyczny update
    mutate({ ...content, title, description }, false);

    try {
      // zapisujemy do GraphQL
      const updated = await upsertContent(key!, { title, description });

      if (updated) {
        // 1) rewalidacja cache ISR po stronie Next.js
        await fetch('/api/revalidate', {
          method: 'POST',
          body: JSON.stringify({ tag: key }),
        });

        // 2) świeży fetch po stronie admina
        await mutate();
      }
    } catch (err) {
      console.error('Update failed:', err);

      // wycofanie optymistycznej zmiany
      mutate();
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
          <AdminMainCard
            title={content.title ?? ''}
            description={content.description ?? ''}
            role={authUser.role}
            onSave={handleSave}
          />
        </div>
      </div>
    </section>
  );
}
