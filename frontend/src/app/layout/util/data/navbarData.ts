import { MenuData } from '@/app/layout/layout-types';

export const menuData: MenuData[] = [
  {
    title: 'Work',
    href: '/#projects',
    option: [
      {
        title: 'Projects',
        href: '/#projects',
        imageSrc: '/svg/menu/puzzle.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Experience',
        href: '/#experience',
        imageSrc: '/svg/menu/team.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'How I work',
        href: '/#workflow',
        imageSrc: '/svg/menu/handshake.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'CMS',
    href: '/cms',
    option: [
      {
        title: 'Features',
        href: '/cms#breakdown',
        imageSrc: '/svg/menu/brain.svg',
        imageW: 35,
        imageH: 35,
      },
      {
        title: 'Design decisions',
        href: '/cms#why',
        imageSrc: '/svg/menu/plug.svg',
        imageW: 35,
        imageH: 35,
      },
    ],
  },
  {
    title: 'Contact',
    href: '/#contact',
    option: [],
  },
];
