'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DropdownOptionProps } from '@/app/layout/layout-types';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useSmoothScrollTo } from '@/app/layout/ui/navbar/main-menu-bar/useSmoothScrollTo';

export function MobileDropdownOption({
  title,
  href,
  imageSrc,
  imageW,
  imageH,
}: DropdownOptionProps) {
  const { closeBar, setScrollingToAnchor } = useMobileBarStore();
  const scrollTo = useSmoothScrollTo();
  const isAnchor = href.startsWith('/#');

  const handleClick = () => {
    closeBar();
    if (isAnchor) {
      setScrollingToAnchor(true);
      scrollTo(href.replace('/#', ''));
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-foreground/20 w-[290px] px-4 h-14 text-base transition-all hover:scale-[1.02] hover:border-foreground/40 hover:shadow-md hover:bg-accent active:scale-[0.98] active:bg-accent"
    >
      <Image
        src={imageSrc}
        alt={title}
        width={imageW}
        height={imageH}
        priority
      />
      <p className="text-center">{title}</p>
    </Link>
  );
}
