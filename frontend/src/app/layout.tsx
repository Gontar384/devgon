import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/navbar/Navbar';
import { Footer } from '@/components/layout/footer/Footer';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import MobileBar from '@/components/layout/navbar/MobileBar';

export const metadata: Metadata = {
  ...createMetadata({
    title: 'devgon',
    description:
      'Tworzymy inteligentne strony internetowe, będące zaawansowanymi systemami zarządzania treścią. Oferujemy automatyzację procesów przy użyciu najnowszych technologii, w tym AI.',
    path: '/',
    image: '/logo/logo_caption_black.svg',
  }),
  icons: {
    icon: '/logo-icon/favicon.ico',
    shortcut: '/logo-icon/favicon-96x96.png',
    apple: '/logo-icon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        <MobileBar />
        <main className="min-h-screen mt-16">{children}</main>
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
