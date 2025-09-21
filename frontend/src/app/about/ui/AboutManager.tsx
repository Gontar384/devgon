import React from 'react';
import { AboutMainCard } from '@/app/about/ui/main-card/AboutMainCard';

export function AboutManager() {
  return (
    <section className="w-full min-h-screen relative">
      <div className="flex flex-col items-center px-2">
        <div className="grid grid-cols-1 gap-8 max-w-7xl w-full mt-14">
          <AboutMainCard
            title={'test'}
            description={'testtesttssssssssssssssssssssssssssssssssssesttest'}
            editable={true}
          />
        </div>
      </div>
    </section>
  );
}
