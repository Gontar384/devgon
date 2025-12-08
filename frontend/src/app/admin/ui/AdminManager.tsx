'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { AdminAboutManager } from '@/app/admin/ui/admin-about/AdminAboutManager';

export function AdminManager({ mainCardContent, authUser }: AdminManagerProps) {
  return (
    <section className="w-full min-h-screen relative">
      <Tabs defaultValue="home" className="mt-24">
        <TabsList className="flex justify-center rounded-none bg-background gap-1">
          <TabsTrigger
            value="home"
            className="cursor-pointer bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
          >
            Strona główna
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="cursor-pointer bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
          >
            O nas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <AdminAboutManager
            mainCardContent={mainCardContent}
            authUser={authUser}
          />
        </TabsContent>
        <TabsContent value="about"></TabsContent>
      </Tabs>
    </section>
  );
}
