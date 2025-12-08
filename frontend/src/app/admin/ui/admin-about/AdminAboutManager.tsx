'use client';
import React from 'react';
import useSWR from 'swr';
import { getContent } from '@/lib/graphql/graphqlUtil';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCard } from '@/components/admin-content/ContentCard';

const fetcher = (key: string) => getContent(key);

export function AdminAboutManager({
  mainCardContent,
  authUser,
}: AdminManagerProps) {
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
          id={mainCardContent?.id}
          key={mainCardContent?.key}
          order={mainCardContent?.order}
          createdAt={mainCardContent?.createdAt}
          updatedAt={mainCardContent?.updatedAt}
          title={mainCardContent?.title}
          header={mainCardContent?.header}
          description={mainCardContent?.description}
          images={mainCardContent?.images}
          video={mainCardContent?.video}
          role={authUser.role}
          mutate={mutate}
        />
      </div>
    </div>
  );
}
