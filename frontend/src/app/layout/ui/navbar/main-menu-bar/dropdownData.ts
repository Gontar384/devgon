import { DropdownData } from '@/app/layout/layout-types';

export const dropdownData: DropdownData[] = [
  {
    title: 'Oferta',
    href: '/',
    option: [
      {
        title: 'Aplikacje biznesowe',
        href: '/',
        imageSrc: '/svg/app.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Optymalizacja procesów',
        href: '/',
        imageSrc: '/svg/analyse.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Automatyzacje i integracje',
        href: '/',
        imageSrc: '/svg/integration.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'O nas',
    href: '/',
    option: [
      {
        title: 'Rozwiązywane problemy',
        href: '/',
        imageSrc: '/svg/problems.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Współpraca',
        href: '/',
        imageSrc: '/svg/plan.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Przykładowe realizacje',
        href: '/',
        imageSrc: '/svg/idea.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'O zespole',
        href: '/',
        imageSrc: '/svg/team.svg',
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
