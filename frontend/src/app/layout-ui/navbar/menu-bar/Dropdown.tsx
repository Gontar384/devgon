import React from 'react';
import Link from 'next/link';
import { MenubarContent, MenubarTrigger } from '@/components/ui/menubar';
import { CircleChevronDown } from 'lucide-react';
import { MenubarMenu } from '@radix-ui/react-menubar';
import { DropdownWrapperProps } from '@/app/layout-ui/types';

export const Dropdown: React.FC<DropdownWrapperProps> = ({
  title,
  href,
  children,
}) => {
  return (
    <MenubarMenu>
      <div className="flex items-center">
        <Link
          href={href}
          className="animate-menubar text-lg py-1 px-2 rounded-xl hover:bg-accent/50 action:bg-accent/50"
        >
          {title}
        </Link>
        <MenubarTrigger className="p-0.5 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar hover:bg-accent/50 action:bg-accent/50">
          <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
        </MenubarTrigger>
      </div>
      <MenubarContent className="bg-background p-0 border border-foreground/50 hidden md:block">
        {children}
      </MenubarContent>
    </MenubarMenu>
  );
};
