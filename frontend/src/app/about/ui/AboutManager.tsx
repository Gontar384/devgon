'use client';

import React from 'react';
import { Content } from '@/lib/graphql/graphql-types';
import { AboutMainCard } from '@/app/about/ui/AboutMainCard';

export function AboutManager({ title, description }: Content) {
  return (
    <section className="w-full min-h-screen relative">
      <div className="flex flex-col items-center px-2">
        <h1 className="text-4xl font-extrabold text-center pt-10 pb-4">
          O nas
        </h1>
        <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
          <AboutMainCard title={title ?? ''} description={description ?? ''} />
        </div>
      </div>
    </section>
  );
}
