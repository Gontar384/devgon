import React from 'react';

export interface LoginButtonProps {
  isMobileBar: boolean;
}

export interface DropdownOptionProps {
  title: string;
  href: string;
  imageSrc: string;
  imageW: number;
  imageH: number;
}

export interface DropdownData {
  title: string;
  href: string;
  option: DropdownOptionProps[];
}

export interface DropdownWrapperProps {
  title: string;
  href: string;
  children?: React.ReactNode;
}

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
