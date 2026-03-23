import { DropdownData } from '@/app/layout/layout-types';

export const dropdownData: DropdownData[] = [
  {
    title: 'Oferta',
    href: '/#offer',
    option: [
      {
        title: 'Aplikacje biznesowe',
        href: '/',
        imageSrc: '/svg/menu/mobile.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Optymalizacja procesów',
        href: '/',
        imageSrc: '/svg/menu/brain.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Automatyzacje i integracje',
        href: '/',
        imageSrc: '/svg/menu/plug.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'O nas',
    href: '/#introduction',
    option: [
      {
        title: 'Rozwiązywane problemy',
        href: '/#problems',
        imageSrc: '/svg/menu/puzzle.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Jak pracujemy',
        href: '/#collaboration',
        imageSrc: '/svg/menu/handshake.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'O devgon',
        href: '/#about',
        imageSrc: '/svg/menu/team.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'Kontakt',
    href: '/',
    option: [],
  },
];
