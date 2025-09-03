import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DropdownOptionProps } from '@/app/layout-ui/types';

export const MobileDropdownOption: React.FC<DropdownOptionProps> = ({
  title,
  href,
  imageSrc,
  imageW,
  imageH,
}) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl border border-foreground/20 w-72 px-4 h-14 text-base transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md active:scale-[0.98] hover:bg-accent active:bg-accent"
    >
      {title}
      <Image
        src={imageSrc}
        alt={title}
        width={imageW}
        height={imageH}
        priority
      />
    </Link>
  );
};
