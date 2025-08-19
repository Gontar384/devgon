'use client';
import Head from 'next/head';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, path }) => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const url = `https://${siteName}${path}`;

  return (
    <Head>
      <title>
        {title} – {siteName}
      </title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {url && <link rel="canonical" href={url} />}
    </Head>
  );
};

export default SEO;
