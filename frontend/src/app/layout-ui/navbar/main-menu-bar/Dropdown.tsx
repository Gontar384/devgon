import React from 'react';
import Link from 'next/link';
import { MenubarContent, MenubarTrigger } from '@/components/ui/menubar';
import { CircleChevronDown } from 'lucide-react';
import { MenubarMenu } from '@radix-ui/react-menubar';
import { DropdownWrapperProps } from '@/app/layout-ui/types';

export function Dropdown({ title, href, children }: DropdownWrapperProps) {
  return (
    <MenubarMenu>
      <div className="flex items-center">
        <Link
          href={href}
          className="text-lg py-1 px-2 rounded-xl hover:bg-accent/50 active:bg-accent/50"
        >
          {title}
        </Link>
        <MenubarTrigger className="p-0.5 transition-transform duration-100 data-[state=open]:bg-accent/50 data-[state=open]:rotate-180 data-[state=closed]:rotate-0 focus:bg-background hover:bg-accent/50 active:bg-accent/50">
          <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
        </MenubarTrigger>
      </div>
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
    </MenubarMenu>
  );
}
