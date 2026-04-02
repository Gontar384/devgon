'use client';
import React from 'react';
import { MenubarContent, MenubarTrigger } from '@/components/ui/menubar';
import { CircleChevronDown } from 'lucide-react';
import { MenubarMenu } from '@radix-ui/react-menubar';
import { DropdownWrapperProps } from '@/app/layout/layout-types';
import { NavLink } from '@/app/layout/util/NavLink';

export function Dropdown({
  title,
  href,
  children,
  onNavigate,
}: DropdownWrapperProps) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <MenubarMenu value={title}>
      <div className="flex items-center">
        <NavLink
          href={href}
          className="text-xl py-1 px-2 rounded-xl hover:bg-accent active:bg-accent"
        >
          {title}
        </NavLink>
        {hasChildren && (
          <MenubarTrigger
            className="p-0.5 transition-transform duration-100 data-[state=open]:bg-accent data-[state=open]:rotate-180 data-[state=closed]:rotate-0 focus:bg-background hover:bg-accent active:bg-accent"
            id={undefined}
          >
            <CircleChevronDown
              className="!w-7 !h-7 cursor-pointer"
              aria-hidden="true"
            />
          </MenubarTrigger>
        )}
      </div>
      {hasChildren && (
        <MenubarContent
          className="bg-background p-0 border border-foreground/50 hidden md:block"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {React.Children.map(children, (child, index) => (
            <>
              {React.isValidElement(child)
                ? React.cloneElement(
                    child as React.ReactElement<{ onNavigate?: () => void }>,
                    { onNavigate },
                  )
                : child}
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
