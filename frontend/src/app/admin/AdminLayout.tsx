'use client';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="w-full min-h-screen relative">
      <Tabs value={pathname} className="mt-24">
        <TabsList className="flex justify-center rounded-none bg-background gap-1">
          <TabsTrigger
            value="/admin/home"
            className="cursor-pointer bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
            id={undefined} //hydration mismatch error occurred
            aria-controls={undefined}
          >
            <Link href="/admin/home" className="text-xl">
              Strona główna
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="/admin/privacy-policy"
            className="cursor-pointer bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
            id={undefined} //hydration mismatch error occurred
            aria-controls={undefined}
          >
            <Link href="/admin/privacy-policy" className="text-xl">
              Polityka prywatności
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-8">{children}</div>
    </section>
  );
}
