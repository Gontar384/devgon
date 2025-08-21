import React from 'react';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'devgon - Innowacje z pasją',
    description:
      'Tworzymy zaawansowane strony internetowe, będące zaawansowanymi systemami zarządzania treścią. Oferujemy automatyzację procesów przy użyciu najnowszych technologii, w tym AI.',
  });

export default function Home() {
  return <section></section>;
}
