'use client';
import React from 'react';
import useSWR from 'swr';
import { getContent } from '@/lib/graphql/contentService';
import { AdminHomeManagerProps } from '@/app/admin/admin-types';
import { ContentCard } from '@/components/admin-content/ContentCard';

const fetcher = (key: string) => getContent(key);

export function AdminHomeManager({
  mainCardContent,
  authUser,
}: AdminHomeManagerProps) {
  const key = mainCardContent!.key;

  const { data: content, mutate } = useSWR(key, fetcher, {
    fallbackData: mainCardContent,
    revalidateOnFocus: true,
  });

  if (!content) return null;

  return (
    <div className="flex flex-col items-center px-2">
      <h1 className="sr-only">O nas</h1>
      <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
        <ContentCard
          id={content?.id}
          contentKey={content?.key}
          order={content?.order}
          updatedAt={content?.updatedAt}
          title={content?.title}
          header={content?.header}
          description={content?.description}
          images={content?.images}
          video={content?.video}
          role={authUser.role}
          mutate={mutate}
        />
      </div>
    </div>
  );
}
