import React, { AnchorHTMLAttributes } from 'react';
import { AuthUser } from '@/lib/auth/auth-types';
import { LinkProps } from 'next/link';

export interface MenuOptionProps {
  title: string;
  href: string;
  imageSrc: string;
  imageW: number;
  imageH: number;
  onNavigate?: () => void;
}

export interface DropdownWrapperProps {
  title: string;
  href: string;
  children?: React.ReactNode;
  onNavigate?: () => void;
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

export interface MenuData {
  title: string;
  href: string;
  option: MenuOptionProps[];
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

export type NavLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    onNavigate?: () => void;
  };
