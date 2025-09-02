import React from 'react';

export interface LoginButtonInterface {
  isMobileBar: boolean;
}

export interface DropdownOptionInterface {
  title: string;
  href: string;
  imageSrc: string;
  imageW: number;
  imageH: number;
}

export interface DropdownInterface {
  title: string;
  href: string;
  option: DropdownOptionInterface[];
}

export interface DropdownWrapperInterface {
  title: string;
  hRef: string;
  children?: React.ReactNode;
}
