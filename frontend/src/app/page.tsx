import React from 'react';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { ParticlesBackground } from '@/app/page-ui/parts/ParticlesBackground';
import { MainCard } from '@/app/page-ui/main-card/MainCard';
import { SideCard } from '@/app/page-ui/side-card/SideCard';
import mainCardData from '@/app/page-ui/main-card/mainCardData.json';
import sideCardData from '@/app/page-ui/side-card/sideCardData.json';
import { MainCardProps, SideCardProps } from '@/app/page-ui/types';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Strona główna',
    description:
      'Poznaj naszą ofertę: inteligentne strony internetowe, nowoczesne rozwiązania technologiczne i automatyzacja procesów – wszystko dla twojej firmy.',
    path: '/',
  });

export default function Home() {
  const typedMainCardData: MainCardProps = mainCardData;
  const typedSideCardData: SideCardProps[] = sideCardData;

  return (
    <section className="w-full min-h-screen relative select-none">
      <ParticlesBackground />
      <div className="relative flex flex-col items-center px-4 z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mt-14">
          <div className="md:col-span-3">
            <MainCard
              title={typedMainCardData.title}
              description={typedMainCardData.description}
              content={typedMainCardData.content}
              imageSrc={typedMainCardData.imageSrc}
              imageW={typedMainCardData.imageW}
              imageH={typedMainCardData.imageH}
            />
          </div>
          {typedSideCardData.map((card) => (
            <SideCard
              key={card.title}
              title={card.title}
              description={card.description}
              content={card.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
