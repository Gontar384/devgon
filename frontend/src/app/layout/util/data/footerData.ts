import {
  FooterLinkData,
  ShortNoteData,
  SocialLinkData,
} from '@/app/layout/layout-types';

export const shortNote: ShortNoteData = {
  imageSrc: '/svg/footer/page-designer.svg',
  imageAlt: 'Jakub Gontarek, Fullstack Engineer',
  imageW: 92,
  imageH: 84,
  title: 'Jakub Gontarek',
  description:
    'Fullstack Engineer. I take features end-to-end - architecture, API, UI, tests and deployment. This site runs on devgon, a CMS I built myself.',
};

export const smallMenu: FooterLinkData[] = [
  {
    title: 'Start',
    href: '/',
  },
  {
    title: 'Projects',
    href: '/#projects',
  },
  {
    title: 'Experience',
    href: '/#experience',
  },
  {
    title: 'About me',
    href: '/#about',
  },
  {
    title: 'The CMS',
    href: '/cms',
  },
  {
    title: 'Contact',
    href: '/#contact',
  },
];

export const socialLinks: SocialLinkData[] = [
  {
    title: 'GitHub',
    href: 'https://github.com/Gontar384',
    iconSrc: '/svg/footer/github.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/in/jakub-gontarek-3b8210370',
    iconSrc: '/svg/footer/linkedin.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
];

export const otherLinks: FooterLinkData[] = [
  {
    title: 'Privacy policy',
    href: '/privacy-policy',
  },
];
