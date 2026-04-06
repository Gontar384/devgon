'use client';
import React from 'react';
import Image from 'next/image';
import { MenubarItem } from '@/components/ui/menubar';
import { MenuOptionProps } from '@/app/layout/layout-types';
import { NavLink } from '@/app/layout/util/NavLink';

export function DropdownOption({
  title,
  href,
  imageSrc,
  imageW,
  imageH,
}: MenuOptionProps) {
  return (
    <MenubarItem asChild className="text-base">
      <NavLink
        href={href}
        className="cursor-pointer h-12 flex items-center gap-2 !rounded-none active:bg-accent"
      >
        <Image src={imageSrc} alt={title} width={imageW} height={imageH} />
        {title}
      </NavLink>
    </MenubarItem>
  );
}
