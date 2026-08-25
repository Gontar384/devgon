import { Metadata } from 'next';
import { MetadataOptions } from '@/lib/metadata/metadata-types';

const siteName = process.env.NEXT_PUBLIC_DOMAIN;
const siteUrl = `https://${siteName}`;

/**
 * Generates a Next.js Metadata object with canonical URL, OpenGraph,
 * and Twitter Card tags. The `image` field defaults to the site-wide social
 * card — Next overwrites the whole `openGraph` object per segment rather than
 * merging it, so every page has to carry its own image or lose the parent's.
 * Site name and base URL are read from NEXT_PUBLIC_DOMAIN env variable.
 */
export function createMetadata({
  title,
  description,
  path,
  image = '/logo/og.png',
}: MetadataOptions): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;

  return {
    metadataBase: new URL(siteUrl),
    robots: { index: true, follow: true },
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
