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

export interface DropdownData {
  title: string;
  href: string;
  option: DropdownOptionProps[];
}

export interface LoginButtonData {
  buttonContent: string;
  tooltipContent: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
  buttonAlt: string;
}

export interface LogoutButtonData {
  tooltipContent: string;
}

export interface LoginDialogData {
  dialogTitle: string;
  dialogDescription: string;
  loginButton: string;
  cancelButton: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
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

export interface DropdownOptionProps {
  title: string;
  href: string;
  imageSrc: string;
  imageW: number;
  imageH: number;
}

export interface DropdownWrapperProps {
  title: string;
  href: string;
  children?: React.ReactNode;
}

export interface AuthButtonProps {
  isMobileBar: boolean;
  authUser: AuthUser;
}

export interface LoginButtonProps extends AuthButtonProps {
  showTooltip: boolean;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LogoutButtonProps {
  authUser: AuthUser;
  showTooltip: boolean;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LoginDialogProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
