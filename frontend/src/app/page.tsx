import React from 'react';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { ParticlesBackground } from '@/app/page-ui/ParticlesBackground';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Hero from '@/app/page-ui/Hero';
import Image from 'next/image';
import Hero1 from '@/app/page-ui/Hero1';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Innowacje z pasją',
    description:
      'Tworzymy inteligentne strony internetowe, będące zaawansowanymi systemami zarządzania treścią. Oferujemy automatyzację procesów przy użyciu najnowszych technologii, w tym AI.',
    path: '/',
  });

export default function Home() {
  return (
    <section className="w-full min-h-screen relative select-none">
      <ParticlesBackground />

      <div className="relative flex flex-col items-center px-4 z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mt-8">
          <div className="md:col-span-3">
            <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>
                      <Hero text="devgon" />
                    </CardTitle>
                    <CardDescription>
                      Tutaj możesz umieścić dłuższy opis albo coś, co ma być
                      bardziej wyróżnione.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    To jest ten większy card u góry — zajmuje całą szerokość
                    siatki.
                  </CardContent>
                </div>
                <div className="flex-shrink-0 pr-4">
                  <Image
                    src="/image/homepage-dev-image.png"
                    alt="Web developer"
                    width={400}
                    height={400}
                    priority
                    className="rounded-lg"
                  />
                </div>
              </div>
            </Card>
          </div>
          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
            <CardHeader>
              <CardTitle>
                <Hero1 text="Innowacje" />
              </CardTitle>
              <CardDescription>
                Tutaj możesz wstawić swoją treść o innowacjach i technologiach.
              </CardDescription>
            </CardHeader>
            <CardContent>Dowolny content o innowacjach</CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
            <CardHeader>
              <CardTitle>
                <Hero1 text="Automatyzacja" />
              </CardTitle>
              <CardDescription>
                Opis automatyzacji procesów przy użyciu AI lub innych narzędzi.
              </CardDescription>
            </CardHeader>
            <CardContent>Dowolny content o automatyzacji</CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
            <CardHeader>
              <CardTitle>
                <Hero1 text="Systemy CRM" />
              </CardTitle>
              <CardDescription>
                Możesz opisać systemy zarządzania treścią i ich funkcjonalności.
              </CardDescription>
            </CardHeader>
            <CardContent>Dowolny content o systemach</CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
