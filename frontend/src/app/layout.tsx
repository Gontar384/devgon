import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/app/layout-ui/navbar/Navbar';
import { Footer } from '@/app/layout-ui/footer/Footer';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import MobileBar from '@/app/layout-ui/navbar/MobileBar';
import layoutData from '@/app/layout-ui/layoutData.json';
import { getAuthUser } from '@/lib/checkUser';

export const metadata: Metadata = {
  ...createMetadata(layoutData.metaData),
  icons: layoutData.metaData.icons,
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
        <Navbar authUser={authUser} />
        <MobileBar authUser={authUser} />
        <main className="min-h-screen mt-16">{children}</main>
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
