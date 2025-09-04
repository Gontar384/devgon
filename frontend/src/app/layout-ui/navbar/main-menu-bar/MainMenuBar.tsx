import { Menubar } from '@radix-ui/react-menubar';
import React from 'react';
import { Dropdown } from '@/app/layout-ui/navbar/main-menu-bar/Dropdown';
import layoutData from '@/app/layout-ui/layoutData.json';
import { DropdownOption } from '@/app/layout-ui/navbar/main-menu-bar/DropdownOption';
import { DropdownData } from '@/app/layout-ui/types';

export function MainMenuBar() {
  const typedMenuData: DropdownData[] = layoutData.menuData;

  return (
    <div
      className="hidden md:flex select-none"
      aria-label="Główne opcje nawigacji"
    >
      <Menubar className="flex gap-1">
        {typedMenuData.map((dropdown) => (
          <Dropdown
            title={dropdown.title}
            href={dropdown.href}
            key={dropdown.title}
          >
            {dropdown.option.map((option) => (
              <DropdownOption
                key={option.title}
                title={option.title}
                href={option.href}
                imageSrc={option.imageSrc}
                imageW={option.imageW}
                imageH={option.imageH}
              />
            ))}
          </Dropdown>
        ))}
      </Menubar>
    </div>
  );
}
