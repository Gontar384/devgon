import { FooterLinkData, SocialLinkData } from '@/app/layout/layout-types';

export const socialLinks: SocialLinkData[] = [
  {
    title: 'Facebook',
    href: 'https://www.facebook.com/kuba.gontarek.3',
    iconSrc: '/svg/footer/facebook.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/g0ntar',
    iconSrc: '/svg/footer/instagram.svg',
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
  {
    title: 'GitHub',
    href: 'https://github.com/Gontar384',
    iconSrc: '/svg/footer/github.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
];

export const smallMenu: FooterLinkData[] = [
  {
    title: 'Start',
    href: '/',
  },
  {
    title: 'Oferta',
    href: '/#offer',
  },
  {
    title: 'Współpraca',
    href: '/#solutions',
  },
  {
    title: 'O devgon',
    href: '/#about',
  },
];

export const otherLinks: FooterLinkData[] = [
  {
    title: 'Polityka prywatności',
    href: '/privacy-policy',
  },
];
