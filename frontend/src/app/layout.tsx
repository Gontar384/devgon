import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/app/layout/ui/footer/Footer';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata/metadata';
import MobileBar from '@/app/layout/ui/navbar/mobile-bar/MobileBar';
import NavbarClient from '@/app/layout/ui/navbar/NavbarClient';
import { LoginDialog } from '@/app/layout/ui/navbar/login-dialog/LoginDialog';
import { AuthInitializer } from '@/lib/auth/AuthInitializer';
import { CookieBanner } from '@/app/layout/ui/CookieBanner';

export const metadata: Metadata = {
  ...createMetadata({
    title: 'devgon – Nowoczesne aplikacje i automatyzacja dla firm',
    description:
      'Tworzymy inteligentne aplikacje biznesowe, optymalizujemy procesy i integrujemy systemy. Skup się na rozwoju firmy, resztę zostaw nam.',
    path: '/',
    image: '/logo/logo-caption-black.svg',
  }),
  icons: {
    icon: '/logo-icon/favicon.ico',
    shortcut: '/logo-icon/favicon-96x96.png',
    apple: '/logo-icon/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <AuthInitializer />
        <NavbarClient />
        <MobileBar />
        <main className="min-h-screen mt-16">{children}</main>
        <Footer />
        <LoginDialog />
        <Toaster position="bottom-center" />
        <CookieBanner />
      </body>
    </html>
  );
}
