import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ];
}
