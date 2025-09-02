import { NextResponse } from 'next/server';

export const GET = () => {
  const siteName = process.env.NEXT_PUBLIC_DOMAIN;

  const content = `
User-agent: *
Allow: /
Sitemap: https://${siteName}/sitemap.xml`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
