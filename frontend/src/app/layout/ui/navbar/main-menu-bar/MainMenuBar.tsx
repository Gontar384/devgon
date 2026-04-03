'use client';
import { Menubar } from '@radix-ui/react-menubar';
import React, { useEffect, useState } from 'react';
import { Dropdown } from '@/app/layout/ui/navbar/main-menu-bar/Dropdown';
import { DropdownOption } from '@/app/layout/ui/navbar/main-menu-bar/DropdownOption';
import { dropdownData } from '@/app/layout/util/dropdownData';

export function MainMenuBar() {
  const [openMenu, setOpenMenu] = useState('');

  useEffect(() => {
    const onHide = () => setOpenMenu('');
    window.addEventListener('navbar:hide', onHide);
    return () => window.removeEventListener('navbar:hide', onHide);
  }, []);

  return (
    <div
      className="hidden md:flex select-none"
      aria-label="Główne opcje nawigacji"
    >
      <Menubar
        value={openMenu}
        onValueChange={setOpenMenu}
        className="flex gap-4"
      >
        {dropdownData.map((dropdown) => (
          <Dropdown
            title={dropdown.title}
            href={dropdown.href}
            key={dropdown.title}
            onNavigate={() => setOpenMenu('')}
          >
            {dropdown.option?.map((option) => (
              <DropdownOption
                key={option.title}
                title={option.title}
                href={option.href}
                imageSrc={option.imageSrc}
                imageW={option.imageW}
                imageH={option.imageH}
                onNavigate={() => setOpenMenu('')}
              />
            ))}
          </Dropdown>
        ))}
      </Menubar>
    </div>
  );
}
