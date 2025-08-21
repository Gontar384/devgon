import { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const siteUrl = `https://${siteName}`;

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function createMetadata({
  title,
  description,
  path,
  image,
}: MetadataOptions): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title: `${title} – ${siteName}`,
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
      images: image ? [image] : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: `${title} – ${siteName}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}
