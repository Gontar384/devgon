import { Menubar, MenubarMenu } from '@radix-ui/react-menubar';
import {
  MenubarContent,
  MenubarItem,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { CircleChevronDown } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

export function MainMenu() {
  return (
    <div className="hidden sm:flex">
      <Menubar className="flex gap-5">
        <MenubarMenu>
          <div className="flex items-center gap-1.5">
            <Link href="/" className="select-none animate-menubar text-lg">
              O nas
            </Link>
            <MenubarTrigger className="p-0 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar">
              <CircleChevronDown className="!w-6 !h-6 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/50">
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20"
              >
                Co robimy
                <Image
                  src="/svg/what-we-do.svg"
                  alt="Co robimy"
                  width={35}
                  height={34}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20"
              >
                Nasz zespół
                <Image
                  src="/svg/our-team.svg"
                  alt="Nasz zespół"
                  width={67}
                  height={37}
                  priority
                />
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <div className="flex items-center gap-1.5">
            <Link
              href="/products"
              className="select-none animate-menubar text-lg"
            >
              Oferta
            </Link>
            <MenubarTrigger className="p-0 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar">
              <CircleChevronDown className="!w-6 !h-6 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/50">
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20"
              >
                Usługi
                <Image
                  src="/svg/offer.svg"
                  alt="Usługi"
                  width={42}
                  height={45}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20"
              >
                Czemu warto
                <Image
                  src="/svg/why-its-worth.svg"
                  alt="Czemu warto"
                  width={46}
                  height={36}
                  priority
                />
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <div className="flex items-center gap-1.5">
            <Link href="/" className="select-none animate-menubar text-lg">
              Kontakt
            </Link>
            <MenubarTrigger className="p-0 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar">
              <CircleChevronDown className="!w-6 !h-6 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/50">
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20"
              >
                Odezwij się
                <Image
                  src="/svg/call-us.svg"
                  alt="Odezwij się"
                  width={40}
                  height={40}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="select-none cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20"
              >
                Gdzie znaleźć
                <Image
                  src="/svg/where-to-find.svg"
                  alt="Gdzie znaleźć"
                  width={33}
                  height={42}
                  priority
                />
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
