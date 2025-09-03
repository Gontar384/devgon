import { Menubar } from '@radix-ui/react-menubar';
import React from 'react';
import { Dropdown } from '@/app/layout-ui/navbar/menu-bar/Dropdown';
import menuData from '@/app/layout-ui/navbar/menuData.json';
import { DropdownOption } from '@/app/layout-ui/navbar/menu-bar/DropdownOption';
import { DropdownData } from '@/app/layout-ui/types';

export function MenuBar() {
  const typedMenuData: DropdownData[] = menuData;

  return (
    <div className="hidden md:flex select-none">
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
