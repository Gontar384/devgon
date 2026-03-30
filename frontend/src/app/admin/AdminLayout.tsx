'use client';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import { NavLink } from '../layout/util/NavLink';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="w-full min-h-screen relative">
      <Tabs value={pathname} className="mt-20">
        <div className="overflow-x-auto py-3">
          <TabsList className="flex justify-center gap-2 min-w-max px-2 md:px-4 py-6 bg-background rounded-none">
            <TabsTrigger
              value="/admin/home"
              className="cursor-pointer bg-background border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
              id={undefined}
              aria-controls={undefined}
            >
              <NavLink href="/admin/home" className="text-xl">
                Strona główna
              </NavLink>
            </TabsTrigger>
            <TabsTrigger
              value="/admin/privacy-policy"
              className="cursor-pointer bg-background border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
              id={undefined}
              aria-controls={undefined}
            >
              <NavLink href="/admin/privacy-policy" className="text-xl">
                Polityka prywatności
              </NavLink>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      <div className="mt-8">{children}</div>
    </section>
  );
}
