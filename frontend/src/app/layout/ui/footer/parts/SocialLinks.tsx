import { socialLinks } from '@/app/layout/util/linksData';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export function SocialLinks() {
  return (
    <div
      className="flex flex-col gap-2 text-sm text-muted-foreground"
      aria-label="Linki społecznościowe"
    >
      <div className="font-semibold">Social media</div>
      <div className="flex flex-col gap-2">
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
            />
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
