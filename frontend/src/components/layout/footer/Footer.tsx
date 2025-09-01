import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="px-2 select-none mt-16">
      <Card>
        <CardContent className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 gap-6">
          <div className="flex items-center gap-4 pr-10">
            <Image
              src="/svg/footer-page-designer.svg"
              alt="Page designer image"
              width={50}
              height={46}
              priority
            />
            <div className="flex flex-col text-sm text-muted-foreground whitespace-nowrap">
              <span>© 2025 devgon</span>
              <span>All rights reserved</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 whitespace-nowrap">
            <Link
              href="/frontend/public"
              className="cursor-pointer hover:underline active:underline"
            >
              Regulamin
            </Link>
            <Link
              href="/frontend/public"
              className="cursor-pointer hover:underline active:underline"
            >
              Polityka prywatności
            </Link>
          </div>
          <div className="flex flex-wrap items-center text-sm gap-4 text-muted-foreground">
            <Link
              href="/frontend/public"
              className="flex items-center gap-1 cursor-pointer hover:underline active:underline"
            >
              <Image
                src="/svg/facebook.svg"
                alt="Page designer image"
                width={24}
                height={24}
                priority
              />
              Facebook
            </Link>
            <Link
              href="/frontend/public"
              className="flex items-center gap-1 cursor-pointer hover:underline active:underline"
            >
              <Image
                src="/svg/instagram.svg"
                alt="Page designer image"
                width={24}
                height={24}
                priority
              />
              Instagram
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-1.5 items-center justify-center text-xs py-2">
        <span>Designed & built by</span>
        <span className="font-bold">devgon</span>
        <Image
          src="/logo/logo_black.svg"
          alt="Mini logo devgon"
          width={16}
          height={12}
          priority
        />
      </div>
    </footer>
  );
}
