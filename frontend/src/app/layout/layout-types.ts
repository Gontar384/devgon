import React from 'react';
import { AuthUser } from '@/lib/auth/auth-types';

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
}

export interface LoginButtonProps extends AuthButtonProps {
  authUser: AuthUser;
  showTooltip: boolean;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  logoutCooldown: boolean;
  setLogoutCooldown: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LogoutButtonProps {
  authUser: AuthUser;
  showTooltip: boolean;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  setLogoutCooldown: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownData {
  title: string;
  href: string;
  option: DropdownOptionProps[];
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
