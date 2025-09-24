import { Menubar } from '@radix-ui/react-menubar';
import React from 'react';
import { Dropdown } from '@/app/layout/ui/navbar/main-menu-bar/Dropdown';
import { DropdownOption } from '@/app/layout/ui/navbar/main-menu-bar/DropdownOption';
import { dropdownData } from '@/app/layout/ui/navbar/main-menu-bar/dropdownData';

export function MainMenuBar() {
  return (
    <div
      className="hidden md:flex select-none"
      aria-label="Główne opcje nawigacji"
    >
      <Menubar className="flex gap-1">
        {dropdownData.map((dropdown) => (
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
