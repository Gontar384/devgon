import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.devgon.pl',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
