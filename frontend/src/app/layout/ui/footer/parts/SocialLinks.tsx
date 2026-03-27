import { socialLinks } from '@/app/layout/ui/footer/linksData';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export function SocialLinks() {
  return (
    <div
      className="flex flex-wrap justify-center md:justify-start text-sm gap-4 text-muted-foreground"
      aria-label="Linki społecznościowe"
    >
      {socialLinks.map((link) => (
        <Link
          href={link.href}
          key={link.title}
          target="_blank"
          rel="noopener noreferrer"
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
  );
}
