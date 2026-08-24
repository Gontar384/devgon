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
import { CookieBanner } from '@/app/layout/ui/additional/CookieBanner';
import { HashScrollHandler } from '@/app/layout/util/useHashScrollOnMount';
import Script from 'next/script';

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Jakub Gontarek — Fullstack Engineer',
    description:
      'Fullstack Engineer with 3 years of experience taking projects from requirements to production. React, Next.js, NestJS, Java, Spring Boot, PostgreSQL, Docker and CI/CD.',
    path: '/',
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
    <html lang="en">
      <body>
        <HashScrollHandler />
        <AuthInitializer />
        <NavbarClient />
        <MobileBar />
        <main id="main-content" tabIndex={-1} className="min-h-screen mt-16">
          {children}
        </main>
        <Footer />
        <LoginDialog />
        <Toaster position="bottom-center" />
        <CookieBanner />
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
