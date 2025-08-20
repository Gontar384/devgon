import './globals.css';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        {/*<Navbar />*/}
        <main className="min-h-screen">{children}</main>
        {/*} <Footer />*/}
      </body>
    </html>
  );
}
