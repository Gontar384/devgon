import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/services/systems`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/services/integrations`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/services/ai`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/privacy-policy`,
      lastModified: new Date(),
    },
  ];
}
