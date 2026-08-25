import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { HomeManager } from '@/app/home/HomeManager';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Jakub Gontarek — Fullstack Engineer',
    description:
      'Fullstack Engineer with 3 years of experience taking projects from requirements to production. React, Next.js, NestJS, Java, Spring Boot, PostgreSQL, Docker and CI/CD.',
    path: '/',
  });

export default async function HomePage() {
  const { contents } = await loadPageContents([
    'home-hero',
    'home-intro',
    'home-projects',
    'home-experience',
    'home-workflow',
    'home-tech',
    'home-about',
    'home-contact',
  ]);

  return (
    <>
      <HomeManager contents={contents} />
    </>
  );
}
