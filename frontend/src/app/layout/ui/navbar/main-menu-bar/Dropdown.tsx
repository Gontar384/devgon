'use client';

import React from 'react';
import Link from 'next/link';
import { MenubarContent, MenubarTrigger } from '@/components/ui/menubar';
import { CircleChevronDown } from 'lucide-react';
import { MenubarMenu } from '@radix-ui/react-menubar';
import { DropdownWrapperProps } from '@/app/layout/layout-types';
import { useSmoothScrollTo } from '@/app/layout/ui/navbar/main-menu-bar/useSmoothScrollTo';

export function Dropdown({ title, href, children }: DropdownWrapperProps) {
  const scrollTo = useSmoothScrollTo();
  const isAnchor = href.startsWith('/#');
  const hasChildren = React.Children.count(children) > 0;

  const handleClick = () => {
    if (isAnchor) {
      scrollTo(href.replace('/#', ''));
    }
  };

  return (
    <MenubarMenu>
      <div className="flex items-center">
        <Link
          href={href}
          onClick={handleClick}
          className="text-xl py-1 px-2 rounded-xl hover:bg-accent active:bg-accent"
        >
          {title}
        </Link>
        {hasChildren && (
          <MenubarTrigger
            className="p-0.5 transition-transform duration-100 data-[state=open]:bg-accent data-[state=open]:rotate-180 data-[state=closed]:rotate-0 focus:bg-background hover:bg-accent active:bg-accent"
            id={undefined} //hydration error fix
          >
            <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
          </MenubarTrigger>
        )}
      </div>
      {hasChildren && (
        <MenubarContent className="bg-background p-0 border border-foreground/50 hidden md:block">
          {React.Children.map(children, (child, index) => (
            <>
              {child}
              {index < React.Children.count(children) - 1 && (
                <div className="h-px bg-foreground/50" />
              )}
            </>
          ))}
        </MenubarContent>
      )}
    </MenubarMenu>
  );
}
