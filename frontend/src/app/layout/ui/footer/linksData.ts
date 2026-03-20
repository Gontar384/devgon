import { FooterLinkData, SocialLinkData } from '@/app/layout/layout-types';

export const footerLinks: FooterLinkData[] = [
  {
    title: 'Regulamin',
    href: '/',
  },
  {
    title: 'Polityka prywatności',
    href: '/',
  },
];

export const socialLinks: SocialLinkData[] = [
  {
    title: 'Facebook',
    href: '/',
    iconSrc: '/svg/footer/facebook.svg',
    iconWidth: 24,
    iconHeight: 24,
  },
  {
    title: 'Instagram',
    href: '/',
    iconSrc: '/svg/footer/instagram.svg',
    iconWidth: 24,
    iconHeight: 24,
  },
];
