import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/app/layout/ui/footer/Footer';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata/metadata';
import MobileBar from '@/app/layout/ui/navbar/mobile-bar/MobileBar';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import NavbarClient from '@/app/layout/ui/navbar/NavbarClient';
import { LoginDialog } from '@/app/layout/ui/navbar/login-dialog/LoginDialog';
import { CursorGlow } from '@/components/extra/CursorGlow';

export const metadata: Metadata = {
  ...createMetadata({
    title: 'devgon',
    description:
      'Inteligentne strony internetowe, automatyzacja procesów i nowoczesne rozwiązania technologiczne – zwiększ efektywność swojej firmy już dziś.',
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
  const authUser = await getAuthUser();
  return (
    <html lang="pl">
      <body>
        <NavbarClient authUser={authUser} />
        <MobileBar authUser={authUser} />
        <main className="min-h-screen mt-16">{children}</main>
        <Footer />
        <LoginDialog />
        <Toaster position="bottom-center" />
        <CursorGlow />
      </body>
    </html>
  );
}
