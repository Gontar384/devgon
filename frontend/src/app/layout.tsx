import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/app/layout/ui/footer/Footer';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import MobileBar from '@/app/layout/ui/navbar/MobileBar';
import layoutData from '@/app/layout/util/layoutData.json';
import { fetchUser } from '@/lib/auth/fetchUser';
import NavbarClient from '@/app/layout/ui/navbar/NavbarClient';
import { LoginDialog } from '@/app/layout/ui/navbar/login-dialog/LoginDialog';

export const metadata: Metadata = {
  ...createMetadata(layoutData.metaData),
  icons: layoutData.metaData.icons,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await fetchUser();
  return (
    <html lang="pl">
      <body>
        <NavbarClient authUser={authUser} />
        <MobileBar authUser={authUser} />
        <main className="min-h-screen mt-16">{children}</main>
        <Footer />
        <Toaster position="bottom-center" />
        <LoginDialog />
      </body>
    </html>
  );
}
