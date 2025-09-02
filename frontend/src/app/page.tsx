import React from 'react';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { ParticlesBackground } from '@/app/page-ui/ParticlesBackground';
import { MainCard } from '@/app/page-ui/MainCard';
import { SmallCard } from '@/app/page-ui/SmallCard';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Strona główna',
    description:
      'Poznaj naszą ofertę: inteligentne strony internetowe, nowoczesne rozwiązania technologiczne i automatyzacja procesów – wszystko dla twojej firmy.',
    path: '/',
  });

export default function Home() {
  return (
    <section className="w-full min-h-screen relative select-none">
      <ParticlesBackground />
      <div className="relative flex flex-col items-center px-4 z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mt-14">
          <div className="md:col-span-3">
            <MainCard
              title="devgon"
              description="asdhasdhsaiku hah sdiuhas iudhasiuhd iuashdi hihasiduh aiush diashdi ushaidh ash"
              content="a oihasod haishd iuhasid hasiudh yawhsid uhasiud hasiud huiasd haus"
              imageSrc="/image/homepage-dev-image.png"
            />
          </div>
          <SmallCard
            title="Innowacje"
            description="Tutaj możesz wstawić swoją treść o innowacjach i technologiach."
            content="Dowolny content o innowacjach"
          />
          <SmallCard
            title="Automatyzacja"
            description="Opis automatyzacji procesów przy użyciu AI lub innych narzędzi."
            content="Dowolny content o automatyzacji"
          />
          <SmallCard
            title="Systemy CRM"
            description="Możesz opisać systemy zarządzania treścią i ich funkcjonalności."
            content="Dowolny content o systemach"
          />
        </div>
      </div>
    </section>
  );
}
