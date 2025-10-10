import Head from 'next/head';
import React from 'react';
import { SITE_WIDE_KEYWORDS, joinKeywords } from '../utils/seoKeywords';

// Import i18n config to get locales (safely)
let configuredLocales: string[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ni = require('../next-i18next.config');
  configuredLocales = (ni && ni.i18n && Array.isArray(ni.i18n.locales)) ? ni.i18n.locales : [];
} catch (_e) {
  configuredLocales = [];
}

type SeoProps = {
  title: string;
  description: string;
  /** caminho da página (ex.: "/cars/bmw-320d") – usado para canonical e hreflang */
  path?: string;
  /** URL absoluta (se você já quiser passar pronta) – tem precedência sobre 'path' */
  url?: string;
  /** imagem OG absoluta */
  image?: string;
  keywords?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  ogType?: 'website' | 'article' | 'product';
  /** define meta robots como noindex,nofollow quando true */
  noindex?: boolean;
  /** structured data JSON-LD (objeto ou array) */
  jsonLd?: any;
  /** twitter handle do site/autor (sem @ ou com @, ambos ok) */
  twitterSite?: string;
  twitterCreator?: string;
  /** locale OG (ex.: "pt_PT") */
  locale?: string;
};

export default function Seo({
  title,
  description,
  path,
  url,
  image,
  keywords,
  twitterCard = 'summary_large_image',
  ogType = 'website',
  noindex = false,
  jsonLd,
  twitterSite = '@autogo',        // ajuste se quiser
  twitterCreator = '@autogo',      // ajuste se quiser
  locale = 'pt_PT',
}: SeoProps) {
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://autogo.pt';
  const canonical = url || (path ? `${siteOrigin}${path}` : siteOrigin);
  const finalKeywords = keywords || joinKeywords(SITE_WIDE_KEYWORDS);

  // imagem OG absoluta com fallback
  const finalImage =
    image && image.startsWith('http')
      ? image
      : 'https://autogo.pt/og-default.jpg'; // deixe esse arquivo em /public/og-default.jpg (1200x630)

  // hreflang alternates (inclui x-default)
  const alternates =
    configuredLocales.length > 0
      ? configuredLocales.map((loc) => {
          const norm = String(loc).replace('_', '-'); // pt-PT, en-US...
          const href =
            norm === 'pt-PT'
              ? `${siteOrigin}${path || '/'}`
              : `${siteOrigin}/${norm}${path || '/'}`;
          return { hreflang: norm, href };
        })
      : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />
      {!!finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates */}
      {alternates.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}
      {/* x-default aponta para a canonical */}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content="AutoGo" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={twitterSite.startsWith('@') ? twitterSite : `@${twitterSite}`} />
      <meta name="twitter:creator" content={twitterCreator.startsWith('@') ? twitterCreator : `@${twitterCreator}`} />

      {/* JSON-LD structured data */}
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
              name: 'AutoGo',
              url: siteOrigin,
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
