import React from 'react';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { ParticlesBackground } from '@/app/home/ui/ParticlesBackground';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Hero from "@/app/home/ui/Hero";

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Innowacje z pasją',
    description:
      'Tworzymy inteligentne strony internetowe, będące zaawansowanymi systemami zarządzania treścią. Oferujemy automatyzację procesów przy użyciu najnowszych technologii, w tym AI.',
    path: '/',
  });

export default function Home() {
  return (
    <section className="w-full h-screen relative">
      <ParticlesBackground />
      <Hero />
      {/* Overlay dla karty */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full">
          {/* Przykładowa karta */}
          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Innowacje</CardTitle>
              <CardDescription>
                Tutaj możesz wstawić swoją treść o innowacjach i technologiach.
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Wklej tu dowolny content */}</CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Automatyzacja</CardTitle>
              <CardDescription>
                Opis automatyzacji procesów przy użyciu AI lub innych narzędzi.
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Wklej tu dowolny content */}</CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-xl hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Systemy CMS</CardTitle>
              <CardDescription>
                Możesz opisać systemy zarządzania treścią i ich funkcjonalności.
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Wklej tu dowolny content */}</CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
