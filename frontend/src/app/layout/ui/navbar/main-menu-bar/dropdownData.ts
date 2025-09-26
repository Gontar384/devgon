import { DropdownData } from '@/app/layout/util/types';

export const dropdownData: DropdownData[] = [
  {
    title: 'O nas',
    href: '/about',
    option: [
      {
        title: 'Czym się zajmujemy?',
        href: '/about',
        imageSrc: '/svg/btn-what-we-do.svg',
        imageW: 34,
        imageH: 33,
      },
      {
        title: 'Nasz zespół',
        href: '/about',
        imageSrc: '/svg/btn-our-team.svg',
        imageW: 60,
        imageH: 31,
      },
      {
        title: 'Aktualności',
        href: '/about',
        imageSrc: '/svg/btn-news.svg',
        imageW: 39,
        imageH: 34,
      },
    ],
  },
  {
    title: 'Oferta',
    href: '/products',
    option: [
      {
        title: 'Świadczone usługi',
        href: '/products',
        imageSrc: '/svg/btn-our-offer.svg',
        imageW: 40,
        imageH: 42,
      },
      {
        title: 'Dlaczego warto?',
        href: '/products',
        imageSrc: '/svg/btn-why-its-worth.svg',
        imageW: 42,
        imageH: 33,
      },
    ],
  },
  {
    title: 'Kontakt',
    href: '/',
    option: [
      {
        title: 'Skontaktuj się',
        href: '/',
        imageSrc: '/svg/btn-contact-us.svg',
        imageW: 47,
        imageH: 30,
      },
      {
        title: 'Gdzie nas znaleźć?',
        href: '/products',
        imageSrc: '/svg/btn-where-to-find-us.svg',
        imageW: 44,
        imageH: 36,
      },
    ],
  },
];
