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
    <div className="hidden sm:flex select-none">
      <Menubar className="flex gap-1">
        <MenubarMenu>
          <div className="flex items-center">
            <Link
              href="/"
              className="animate-menubar text-lg py-1 px-2 rounded-xl hover:bg-accent/50 action:bg-accent/50"
            >
              O nas
            </Link>
            <MenubarTrigger className="p-0.5 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar hover:bg-accent/50 action:bg-accent/50">
              <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/20 hidden sm:block">
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20 active:bg-accent"
              >
                Czym się zajmujemy?
                <Image
                  src="/svg/btn-what-we-do.svg"
                  alt="Czym się zajmujemy?"
                  width={34}
                  height={33}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none rounded-b-none border border-foreground/20 active:bg-accent"
              >
                Nasz zespół
                <Image
                  src="/svg/btn-our-team.svg"
                  alt="Nasz zespół"
                  width={60}
                  height={31}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20 active:bg-accent"
              >
                Aktualności
                <Image
                  src="/svg/btn-news.svg"
                  alt="Aktualności"
                  width={39}
                  height={34}
                  priority
                />
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <div className="flex items-center">
            <Link
              href="/products"
              className="animate-menubar text-lg py-1 px-2 rounded-xl hover:bg-accent/50 action:bg-accent/50"
            >
              Oferta
            </Link>
            <MenubarTrigger className="p-0.5 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar hover:bg-accent/50 action:bg-accent/50">
              <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/20 hidden sm:block">
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20 active:bg-accent"
              >
                Świadczone usługi
                <Image
                  src="/svg/btn-our-offer.svg"
                  alt="Świadczone usługi"
                  width={40}
                  height={42}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20 active:bg-accent"
              >
                Dlaczego warto?
                <Image
                  src="/svg/btn-why-its-worth.svg"
                  alt="Dlaczego warto?"
                  width={42}
                  height={33}
                  priority
                />
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <div className="flex items-center">
            <Link
              href="/"
              className="animate-menubar text-lg py-1 px-2 rounded-xl hover:bg-accent/50 action:bg-accent/50"
            >
              Kontakt
            </Link>
            <MenubarTrigger className="p-0.5 data-[state=open]:bg-background data-[state=open]:rotate-180 focus:bg-background animate-menubar active:bg-accent hover:bg-accent/50 action:bg-accent/50">
              <CircleChevronDown className="!w-7 !h-7 cursor-pointer" />
            </MenubarTrigger>
          </div>
          <MenubarContent className="bg-background p-0 border border-foreground/20 hidden sm:block">
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-b-none border border-foreground/20 active:bg-accent"
              >
                Skontaktuj się
                <Image
                  src="/svg/btn-contact-us.svg"
                  alt="Skontaktuj się"
                  width={47}
                  height={30}
                  priority
                />
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link
                href="/"
                className="cursor-pointer h-12 py-2 flex items-center gap-2 rounded-t-none border border-foreground/20"
              >
                Gdzie nas znaleźć?
                <Image
                  src="/svg/btn-where-to-find-us.svg"
                  alt="Gdzie nas znaleźć?"
                  width={44}
                  height={36}
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
