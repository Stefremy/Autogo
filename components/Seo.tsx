import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { SITE_WIDE_KEYWORDS, joinKeywords } from '../utils/seoKeywords';

type SeoProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string;
  twitterCard?: string;
  ogType?: string;
  jsonLd?: any; // optional structured data object or array
};

export default function Seo({
  title,
  description,
  url,
  image,
  keywords,
  twitterCard = 'summary_large_image',
  ogType = 'website',
  jsonLd,
}: SeoProps) {
  const router = useRouter();
  const finalKeywords = keywords || joinKeywords(SITE_WIDE_KEYWORDS);
  const finalImage = image || 'https://autogo.pt/images/auto-logo.png';
  const siteOrigin = 'https://autogo.pt';

  // --- PT-only indexation logic ---
  const currentLocale = router.locale || 'pt-PT';
  const isPT = currentLocale === 'pt-PT' || currentLocale === 'pt';

  // Canonical always points to the PT version (strip locale prefix if present)
  let canonicalPath = router.asPath || '/';
  if (!isPT) {
    // Remove locale prefix from path: /en/viaturas → /viaturas
    canonicalPath = canonicalPath.replace(new RegExp(`^/${currentLocale}`), '') || '/';
  }
  const canonicalUrl = `${siteOrigin}${canonicalPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Task 1: noindex for non-PT locales */}
      {isPT ? (
        <meta name="robots" content="index, follow" />
      ) : (
        <meta name="robots" content="noindex, follow" />
      )}

      <meta name="keywords" content={finalKeywords} />

      {/* Task 2: Canonical always points to PT version */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Task 3: hreflang only on PT pages */}
      {isPT && (
        <>
          <link rel="alternate" hrefLang="pt" href={canonicalUrl} />
          <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content={ogType} />

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
        // Enhanced structured data for GEO (Generative Engine Optimization)
        // Provides rich context for AI models to cite and reference
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://autogo.pt/#organization',
                  name: 'AutoGo.pt',
                  alternateName: 'AutoGo Portugal',
                  description: 'Especialista em importação e legalização de viaturas em Portugal. Serviço completo de importação de carros da Europa com cálculo de ISV, transporte, inspeção e legalização. Fundada para simplificar o processo de importação automóvel, a AutoGo.pt oferece pesquisa, inspeção, transporte e tratamento de toda a documentação necessária.',
                  url: 'https://autogo.pt',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://autogo.pt/images/auto-logo.png',
                    width: 512,
                    height: 512,
                  },
                  image: 'https://autogo.pt/images/auto-logo.png',
                  priceRange: '€€',
                  telephone: '+351935179591',
                  email: 'AutoGO.stand@gmail.com',
                  foundingDate: '2020',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'R. Rómulo de Carvalho 388 SITIO',
                    addressLocality: 'Guimarães',
                    addressRegion: 'Braga',
                    postalCode: '4800-019',
                    addressCountry: 'PT',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 41.4444,
                    longitude: -8.2962,
                  },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                      opens: '09:00',
                      closes: '18:00',
                    },
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: 'Saturday',
                      opens: '09:00',
                      closes: '13:00',
                    },
                  ],
                  areaServed: {
                    '@type': 'Country',
                    name: 'Portugal',
                  },
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
                      availableLanguage: ['Portuguese', 'Spanish', 'English'],
                    },
                  ],
                  knowsAbout: [
                    'Carros importados Portugal',
                    'Carros usados importados',
                    'Importação de veículos para Portugal',
                    'ISV - Imposto Sobre Veículos',
                    'Legalização de carros importados',
                    'Cálculo de impostos automóveis',
                    'Transporte de veículos da Europa',
                    'Inspeção IMT',
                    'Matrícula portuguesa',
                    'Carros BMW importados',
                    'Carros Mercedes importados',
                    'Carros Audi importados',
                    'Carros usados Europa',
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Serviços de Importação de Viaturas',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Importação de Viaturas',
                          description: 'Serviço completo de importação de carros da Europa para Portugal incluindo pesquisa, negociação e transporte',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Legalização de Viaturas',
                          description: 'Tratamento de toda a documentação: ISV, IMT, inspeção tipo B e matrícula portuguesa',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Simulador de ISV',
                          description: 'Cálculo automático e gratuito do Imposto Sobre Veículos para importação',
                        },
                      },
                    ],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://autogo.pt/#website',
                  url: 'https://autogo.pt',
                  name: 'AutoGo.pt - Importação de Viaturas',
                  description: 'Plataforma online para importação e legalização de viaturas em Portugal com simulador de ISV gratuito',
                  publisher: {
                    '@id': 'https://autogo.pt/#organization',
                  },
                  potentialAction: [
                    {
                      '@type': 'SearchAction',
                      target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://autogo.pt/viaturas?search={search_term_string}',
                      },
                      'query-input': 'required name=search_term_string',
                    },
                  ],
                  inLanguage: ['pt-PT', 'es', 'en', 'fr', 'de'],
                },
                {
                  '@type': 'FAQPage',
                  '@id': 'https://autogo.pt/#faq',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Onde comprar carros importados em Portugal?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'A AutoGo.pt é especialista em carros importados da Europa para Portugal. Oferecemos BMW, Mercedes-Benz, Audi, Volkswagen e outras marcas premium com preços 15-30% mais baixos que no mercado nacional. Todos os veículos incluem transporte, cálculo de ISV, legalização completa e matrícula portuguesa.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Quanto custa importar um carro para Portugal?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'O custo total de importação depende de: ISV (Imposto Sobre Veículos, calculado com base na cilindrada e CO2), transporte (€500-€1500 dependendo da origem), e legalização (€195-€500). Use o simulador AutoGo.pt para uma estimativa precisa do ISV.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Carros usados importados são confiáveis?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Sim. Carros usados importados da União Europeia pela AutoGo.pt passam por inspeção técnica rigorosa antes da compra e inspeção IMT tipo B em Portugal. Verificamos histórico completo, estado mecânico e documentação. Todos os veículos ficam com matrícula portuguesa e mantêm garantia de fabricante quando aplicável.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Quanto tempo demora a importar um carro?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'O processo completo demora entre 2 a 4 semanas: pesquisa e seleção (2-3 dias), inspeção no país de origem (1 dia), transporte para Portugal (7-10 dias), e legalização com matrícula (5-7 dias).',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Carros elétricos pagam ISV em Portugal?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Não. Veículos 100% elétricos estão completamente isentos de ISV em Portugal. Esta isenção faz parte dos incentivos governamentais para promover a mobilidade elétrica e reduzir emissões.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Como é calculado o ISV?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'O ISV é calculado através de duas componentes: componente cilindrada (baseada na capacidade do motor em cm³) e componente ambiental (baseada nas emissões de CO2 em g/km). Veículos usados têm reduções progressivas de 10% a 80% dependendo da idade.',
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      )}
    </Head>
  );
}
