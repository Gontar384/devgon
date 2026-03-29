'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenubarItem } from '@/components/ui/menubar';
import { DropdownOptionProps } from '@/app/layout/layout-types';
import { useNavigation } from '@/app/layout/util/useNavigation';

export function DropdownOption({
  title,
  href,
  imageSrc,
  imageW,
  imageH,
  onNavigate,
}: DropdownOptionProps) {
  const { navigateTo } = useNavigation();

  return (
    <MenubarItem asChild className="text-base">
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onNavigate?.();
          navigateTo(href);
        }}
        className="cursor-pointer h-12 flex items-center gap-2 !rounded-none active:bg-accent"
      >
        <Image
          src={imageSrc}
          alt={title}
          width={imageW}
          height={imageH}
          priority
        />
        {title}
      </Link>
    </MenubarItem>
  );
}
