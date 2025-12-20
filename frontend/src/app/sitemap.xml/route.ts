import { NextResponse } from 'next/server';

export const GET = () => {
  const siteName = process.env.NEXT_PUBLIC_DOMAIN;

  const urls = [
    {
      url: `https://${siteName}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `https://${siteName}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `https://${siteName}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `https://${siteName}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `https://${siteName}/admin/home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `https://${siteName}/admin/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${u.url}</loc><lastmod>${u.lastModified.toISOString()}</lastmod></url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
