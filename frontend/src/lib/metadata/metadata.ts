import { Metadata } from 'next';
import { MetadataOptions } from '@/lib/metadata/metadata-types';

const siteName = process.env.NEXT_PUBLIC_DOMAIN;
const siteUrl = `https://${siteName}`;

export function createMetadata({
  title,
  description,
  path,
  image,
}: MetadataOptions): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} – ${siteName}`,
      description,
      url,
      siteName,
      type: 'website',
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: `${title} – ${siteName}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}
