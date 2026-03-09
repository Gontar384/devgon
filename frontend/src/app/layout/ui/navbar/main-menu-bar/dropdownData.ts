import { DropdownData } from '@/app/layout/layout-types';

export const dropdownData: DropdownData[] = [
  {
    title: 'Oferta',
    href: '/',
    option: [
      {
        title: 'Tworzenie aplikacji biznesowych',
        href: '/',
        imageSrc: '/svg/app.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Automatyzacja i integracje systemów',
        href: '/',
        imageSrc: '/svg/integration.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Audyt i optymalizacja procesów',
        href: '/',
        imageSrc: '/svg/analyse.svg',
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
        title: 'Jakie problemy rozwiązujemy',
        href: '/',
        imageSrc: '/svg/problems.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Jak wygląda współpraca',
        href: '/',
        imageSrc: '/svg/plan.svg',
        imageW: 30,
        imageH: 30,
      },
      {
        title: 'Przykładowe rozwiązania',
        href: '/',
        imageSrc: '/svg/idea.svg',
        imageW: 36,
        imageH: 36,
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
