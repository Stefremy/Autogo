import Head from 'next/head';
import React from 'react';
import { SITE_WIDE_KEYWORDS, joinKeywords } from '../utils/seoKeywords';

type SeoProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string;
  twitterCard?: string;
  jsonLd?: any; // optional structured data object or array
  robots?: string; // optional override for robots/googlebot meta
};

export default function Seo({ title, description, url, image, keywords, twitterCard = 'summary_large_image', jsonLd, robots }: SeoProps) {
  const finalKeywords = keywords || joinKeywords(SITE_WIDE_KEYWORDS);
  const finalImage = image || 'https://autogo.pt/images/auto-logo.png';
  const finalUrl = url || 'https://autogo.pt/';
  const defaultRobots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const robotsContent = robots || defaultRobots;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      {/* Robots directives: encourage indexing, allow large image previews and unlimited snippets/video previews */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical */}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />

      {/* JSON-LD structured data (merge defaults when not provided) */}
      {jsonLd ? (
        Array.isArray(jsonLd) ? (
          jsonLd.map((d, i) => (
            <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
          ))
        ) : (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )
      ) : (
        // Default Organization JSON-LD
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AutoGo.pt',
              url: 'https://autogo.pt',
              logo: 'https://autogo.pt/images/auto-logo.png',
              sameAs: [
                'https://www.facebook.com/AutoGo.pt',
                'https://www.instagram.com/AutoGo.pt',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+351935179591',
                  contactType: 'customer service',
                  areaServed: 'PT',
                  availableLanguage: ['Portuguese'],
                },
              ],
            }),
          }}
        />
      )}
    </Head>
  );
}
