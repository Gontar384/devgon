import { NextResponse } from 'next/server';

export const GET = () => {
  const isProd = process.env.NEXT_PUBLIC_ENV === 'prod';
  const siteName = process.env.NEXT_PUBLIC_DOMAIN;

  const content = `
User-agent: *
Allow: /

${isProd ? `Sitemap: https://${siteName}/sitemap.xml` : ''}
  `.trim();

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
