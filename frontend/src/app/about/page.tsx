import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import aboutData from '@/app/home/util/homeData.json';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AboutManager } from '@/app/about/ui/AboutManager';
import { getContent } from '@/app/about/util/graphqlUtil';
import { MainCardContentData } from '@/app/about/util/types';

export const generateMetadata = (): Metadata =>
  createMetadata(aboutData.metaData);

export default async function AboutPage() {
  const authUser = await verifyAuth('/about');

  const mainCardContent: MainCardContentData = (await getContent(
    'about-main-card',
  )) ?? {
    key: 'about-main-card',
    title: '',
    description: '',
    editable: true,
  };

  return <AboutManager mainCardContent={mainCardContent} authUser={authUser} />;
}
