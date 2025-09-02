import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenubarItem } from '@/components/ui/menubar';
import { DropdownOptionInterface } from '@/app/layout-ui/navbar/types';

export const DropdownOption: React.FC<DropdownOptionInterface> = ({
  title,
  href,
  imageSrc,
  imageW,
  imageH,
}) => {
  return (
    <MenubarItem asChild className="text-base">
      <Link
        href={href}
        className="cursor-pointer h-12 py-2 flex items-center gap-2 !rounded-none active:bg-accent"
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
    </MenubarItem>
  );
};
