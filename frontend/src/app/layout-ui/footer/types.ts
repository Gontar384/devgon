export interface FooterLink {
  title: string;
  href: string;
}

export interface SocialLink extends FooterLink {
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
}

export interface FooterData {
  footerLinks: FooterLink[];
  socialLinks: SocialLink[];
}
