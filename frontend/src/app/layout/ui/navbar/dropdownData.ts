import { DropdownData } from '@/app/layout/layout-types';

export const dropdownData: DropdownData[] = [
  {
    title: 'Oferta',
    href: '/#services',
    option: [
      {
        title: 'Aplikacje biznesowe',
        href: '/services/systems',
        imageSrc: '/svg/menu/mobile.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Optymalizacja procesów',
        href: '/services/integrations',
        imageSrc: '/svg/menu/brain.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Automatyzacje i integracje',
        href: '/services/ai',
        imageSrc: '/svg/menu/plug.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'O nas',
    href: '/#intro',
    option: [
      {
        title: 'Rozwiązywane problemy',
        href: '/#solutions',
        imageSrc: '/svg/menu/puzzle.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Jak pracujemy',
        href: '/#workflow',
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
    href: '/#contact',
    option: [],
  },
];
