import React from 'react';
import { AuthUser } from '@/lib/types/auth-types';

export interface NavbarData {
  authUser: AuthUser;
}

export interface SiteLogoData {
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
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

export interface LoginButtonData {
  buttonContent: string;
  tooltipContent: string;
  tooltipContent1: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
  image1Src: string;
  image1Alt: string;
  image1W: number;
  image1H: number;
  buttonAlt: string;
  tooltipContent3: string;
}

export interface LoginButtonProps {
  isMobileBar: boolean;
  authUser: AuthUser;
}

export interface FooterLinkData {
  title: string;
  href: string;
}

export interface SocialLinkData extends FooterLinkData {
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
}

export interface AllRightsReservedData {
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
  content: string;
  content1: string;
}

export interface DevgonWatermarkData {
  content: string;
  content1: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
}
