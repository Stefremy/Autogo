import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const SITE_NAME = "AutoGo.pt";
const FALLBACK_URL = "https://autogo.pt";
const FALLBACK_IMAGE = `${FALLBACK_URL}/images/auto-logo.png`;

export type StructuredData = Record<string, unknown> | Record<string, unknown>[];

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product" | string;
  keywords?: string | string[];
  noIndex?: boolean;
  structuredData?: StructuredData;
}

const normaliseSiteUrl = (value: string) => value.replace(/\/$/, "");

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return FALLBACK_URL;
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const cleaned = url.startsWith("/") ? url : `/${url}`;
  return `${normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL)}${cleaned}`;
};

const buildCanonicalFromPath = (path: string) => {
  const cleanPath = path.split("?")[0] || "/";
  return ensureAbsoluteUrl(cleanPath === "/" ? "/" : cleanPath);
};

const asKeywords = (keywords?: string | string[]) => {
  if (!keywords) return undefined;
  return Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : keywords;
};

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  keywords,
  noIndex = false,
  structuredData,
}) => {
  const { asPath } = useRouter();
  const canonicalUrl = ensureAbsoluteUrl(canonical || buildCanonicalFromPath(asPath || "/"));
  const ogImage = ensureAbsoluteUrl(image || FALLBACK_IMAGE);
  const resolvedKeywords = asKeywords(keywords);

  const jsonLdPayloads = React.useMemo(() => {
    if (!structuredData) return [] as Record<string, unknown>[];
    const payload = Array.isArray(structuredData) ? structuredData : [structuredData];
    return payload.filter(Boolean) as Record<string, unknown>[];
  }, [structuredData]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_PT" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@AutoGo" />
      {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      {jsonLdPayloads.map((payload, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
      ))}
    </Head>
  );
};

export default Seo;
