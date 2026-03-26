import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AllRightsReserved } from '@/app/layout/ui/footer/parts/AllRightsReserved';
import { DevgonWatermark } from '@/app/layout/ui/footer/parts/DevgonWatermark';
import { footerLinks, socialLinks } from '@/app/layout/ui/footer/linksData';

export function Footer() {
  return (
    <footer className="px-2 select-none mt-24" aria-label="Stopka strony">
      <Card>
        <CardContent className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 gap-6">
          <AllRightsReserved />
          <div
            className="flex flex-wrap items-center justify-center md:justify-start text-sm gap-4 text-muted-foreground"
            aria-label="Linki społecznościowe"
          >
            {socialLinks.map((link) => (
              <Link
                href={link.href}
                key={link.title}
                className="flex items-center gap-1 cursor-pointer hover:underline active:underline"
              >
                <Image
                  className="pointer-events-none"
                  src={link.iconSrc}
                  alt={link.title}
                  width={link.iconWidth}
                  height={link.iconHeight}
                  priority
                />
                {link.title}
              </Link>
            ))}
          </div>
          <div
            className="flex flex-wrap items-center justify-center md:justify-start text-sm text-muted-foreground gap-4 whitespace-nowrap"
            aria-label="Linki do podstron"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="cursor-pointer hover:underline active:underline"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <DevgonWatermark />
    </footer>
  );
}
