import { Metadata } from 'next';
import { MetadataOptions } from '@/lib/metadata/metadata-types';

const siteName = process.env.NEXT_PUBLIC_DOMAIN;
const siteUrl = `https://${siteName}`;

/**
 * Generates a Next.js Metadata object with canonical URL, OpenGraph,
 * and Twitter Card tags. The `image` field is optional — omitting it
 * switches the Twitter card to `summary` instead of `summary_large_image`.
 * Site name and base URL are read from NEXT_PUBLIC_DOMAIN env variable.
 */
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
