# AutoGo.pt — SEO Complete Analysis
**Generated:** 19 February 2026  
**Site:** https://autogo.pt  
**Stack:** Next.js · TypeScript · Tailwind CSS · EmailJS · next-i18next

---

## Table of Contents
1. [Site Architecture Overview](#1-site-architecture-overview)
2. [SEO Component (`Seo.tsx`)](#2-seo-component-seotsx)
3. [Keyword System (`seoKeywords.ts`)](#3-keyword-system-seokeywordsts)
4. [Page-by-Page Audit](#4-page-by-page-audit)
5. [JSON-LD / Schema Markup — Full Inventory](#5-json-ld--schema-markup--full-inventory)
6. [Sitemap & Robots](#6-sitemap--robots)
7. [Internal Linking Map](#7-internal-linking-map)
8. [SEO Gaps & Recommendations](#8-seo-gaps--recommendations)

---

## 1. Site Architecture Overview

| Route | File | Type | Sitemap Priority | `changefreq` |
|---|---|---|---|---|
| `/` | `pages/index.tsx` | Homepage | **1.0** | daily |
| `/viaturas` | `pages/viaturas.tsx` | Listing | 0.9 | daily |
| `/simulador-isv` | `pages/simulador-isv.tsx` | Tool | 0.9 | weekly |
| `/simulador-iuc` | `pages/simulador-iuc.tsx` | Tool | 0.9 | weekly |
| `/pedido` | `pages/pedido.tsx` | CTA/Form | 0.8 | monthly |
| `/como-funciona` | `pages/como-funciona.tsx` | Info | 0.8 | monthly |
| `/importar-carros-portugal` | `pages/importar-carros-portugal.tsx` | Landing | 0.8 | monthly |
| `/legalizar-carro-importado` | `pages/legalizar-carro-importado.tsx` | Landing | 0.8 | monthly |
| `/contacto` | `pages/contacto.tsx` | Contact | 0.8 | yearly |
| `/blog` | `pages/blog.tsx` | Blog index | 0.8 | weekly |
| `/sobre-nos` | `pages/sobre-nos.tsx` | Brand | 0.6 | yearly |
| `/blog/*` | `pages/blog/[slug].tsx` | Articles | 0.4–0.8 | monthly/yearly |
| `/cars/[slug]` | `pages/cars/[slug].tsx` | Car detail | 0.6 | weekly |

**Total indexed pages in sitemap:** ~70+ (core pages + blog articles + car detail pages)

---

## 2. SEO Component (`Seo.tsx`)

### Tags Rendered per Page
| Tag | Value |
|---|---|
| `<title>` | Custom per page |
| `<meta name="description">` | Custom per page |
| `<meta name="robots">` | `index,follow` (all pages) |
| `<meta name="keywords">` | Joined keyword string |
| `<link rel="canonical">` | Full absolute URL |
| `<link rel="alternate" hreflang>` | pt-PT, es, en, fr, de + x-default |
| `<meta property="og:*">` | title, description, url, image, type |
| `<meta name="twitter:*">` | card, title, description, image |
| `<script type="application/ld+json">` | Custom JSON-LD per page or global fallback |

### Default Fallback JSON-LD (pages without custom `jsonLd` prop)
When no `jsonLd` prop is passed, `Seo.tsx` renders a **global `@graph`** with 3 nodes:
- `LocalBusiness` — full business entity (address, phone, geo, hours, `knowsAbout`, `hasOfferCatalog`)
- `WebSite` — with `SearchAction` pointing to `/viaturas?search={search_term_string}`
- `FAQPage` — 6 general Q&As about car importation

### Default OG Image
`https://autogo.pt/images/auto-logo.png`

---

## 3. Keyword System (`seoKeywords.ts`)

### Architecture
The keyword system is a centralized TypeScript module exporting:
- **Named arrays** (used to build `keywords` meta tag strings)
- **`SEO_KEYWORDS` record** (typed `SEOSet` objects per page with `title`, `description`, `keywords`, `primary`, `supporting`, `faq`)
- **`joinKeywords(...lists)`** utility — deduplicates and joins arrays into a comma-separated string

### `SEOSet` Type
```ts
type SEOSet = {
  title?: string;
  description?: string;
  primary: string[];
  supporting?: string[];
  keywords?: string[];
  faq?: string[];
};
```

---

### Site-Wide Keyword Pool (`SITE_WIDE_KEYWORDS`) — 14 terms
Used on **every page** via `joinKeywords()`.

| # | Keyword |
|---|---|
| 1 | carros importados |
| 2 | carros europeus |
| 3 | carros usados |
| 4 | carros seminovos europeus |
| 5 | carros em segunda mão |
| 6 | AutoGo.pt |
| 7 | isv |
| 8 | isv 2026 |
| 9 | legalizar carros |
| 10 | simulador iuc |
| 11 | simulador iuc 2026 |
| 12 | iuc calculadora |

---

### `IUC_KEYWORDS` Pool — 17 terms
Used on `simulador-iuc` page.

| # | Keyword | Intent |
|---|---|---|
| 1 | simulador iuc | Informational |
| 2 | iuc | Broad |
| 3 | iuc 2026 | Year-specific |
| 4 | calcular iuc | Transactional |
| 5 | tabela iuc 2026 | Informational |
| 6 | simulador iuc 2026 | Year-specific |
| 7 | iuc calculadora | Tool |
| 8 | iuc carros importados | Commercial |
| 9 | iuc carro importado alemanha | Commercial |
| 10 | simulador iuc carro importado | Commercial |
| 11 | iuc importação automóvel | Commercial |
| 12 | iuc 2026 quando pagar | Trending |
| 13 | iuc 2026 data pagamento | Trending |
| 14 | iuc carros elétricos 2026 | Trending |
| 15 | iuc híbridos 2026 | Trending |
| 16 | simulador legalização auto | Tool |
| 17 | simulador legalização automóvel | Tool |

---

### `SIMULADOR_KEYWORDS` Pool — 24 terms
Used on `simulador-isv` page.

| # | Keyword | Note |
|---|---|---|
| 1–6 | simulador isv, isv simulador, simulador isv 2026, etc. | Core |
| 7–13 | isv simulador 2021–2025 | Evergreen/residual volume |
| 14 | isv | Tier-1 broad |
| 15 | ISV Portugal | Geo |
| 16 | cálculo ISV | Informational |
| 17 | importar carro Portugal | Commercial |
| 18 | legalização viaturas | Commercial |
| 19–24 | simulador iuc, iuc calculadora, simulador legalização auto, etc. | Cross-intent |

---

### `HOME_KEYWORDS` Pool — 21 terms
Used on homepage, covers importation, simulators, brands, and geo terms.

### `VIATURAS_KEYWORDS` Pool — 23 terms
Covers stock/listing intent: brand-specific (BMW, Mercedes, Audi, VW, etc.) + generic listing terms.

### `BLOG_KEYWORDS` Pool — 16 terms
Covers informational/editorial content: guides, reviews, ISV news.

### `COMO_FUNCIONA_KEYWORDS` Pool — 10 terms
Process-oriented: "chave na mão", "processo importação", "legalizar carro estrangeiro".

### `GEO_KEYWORDS` Pool — 3 terms
Geographic intent: Guimarães, Braga, Norte de Portugal.

### `CONTENT_KEYWORDS` Pool — 5 terms
Deep-content: "isv vs iuc", "documentos legalizar carro importado", "custos importar carro usado".

---

### `SEO_KEYWORDS` Record — Per-Page Definitions

#### `home`
| Field | Value |
|---|---|
| **Title** | Importar Carros da Alemanha \| Simulador ISV 2026 Grátis \| AutoGo.pt |
| **Description** | Importe o seu carro da Europa com tudo incluído — ISV, legalização e entrega em Portugal. Poupe até 7.000€. Simulador ISV grátis. Guimarães. |
| **Keywords (7)** | importar carros, importar carros da alemanha, importação de carros, simulador isv, carros importados portugal, legalização automóvel, AutoGo.pt |
| **Primary** | importar carro para Portugal · importação de viaturas |
| **FAQs (5)** | Quanto custa importar? · Quanto poupar? · Qual o prazo? · Elétricos pagam ISV? · O que inclui o serviço? |

---

#### `simulador_isv`
| Field | Value |
|---|---|
| **Title** | Simulador ISV 2026 GRÁTIS Portugal \| Resultado Instantâneo \| AutoGo.pt |
| **Description** | Calcule o ISV em segundos — o simulador mais preciso de Portugal. Grátis, sem registo, atualizado 2026. Carros novos, usados e elétricos. AutoGo.pt |
| **Keywords (16)** | simulador isv, isv simulador, simulador isv 2026, isv simulador 2026, calcular isv portugal, tabela isv 2026, isv, isv simulador 2021–2025, simulador legalização auto |
| **Primary** | Simulador ISV · calcular ISV |
| **FAQs (5)** | Como calcular ISV? · NEDC vs WLTP? · Elétricos pagam ISV? · Redução usados? · Simulador gratuito? |

---

#### `simulador_iuc`
| Field | Value |
|---|---|
| **Title** | Simulador IUC 2026 GRÁTIS \| Calcular IUC Portugal \| AutoGo.pt |
| **Description** | Calcule o IUC 2026 grátis em segundos — tabelas oficiais, carros importados, elétricos e híbridos. Nova data de pagamento IUC 2026 explicada. AutoGo.pt |
| **Keywords (26)** | simulador iuc, iuc, iuc 2026, calcular iuc, tabela iuc 2026, simulador iuc 2026, iuc calculadora, calcular iuc portugal, iuc categoria a/b, iuc gasolina/gasóleo 2026, iuc elétrico isento, iuc nedc wltp, taxa adicional gasóleo iuc, iuc carros importados, isv vs iuc, iuc carro importado alemanha, iuc 2026 quando pagar, iuc carros elétricos 2026, iuc híbridos 2026 |
| **Primary** | Simulador IUC 2026 · calcular IUC · IUC 2026 Portugal |
| **FAQs (8)** | O que é o IUC? · Como é calculado? · Quando pagar 2026? · Elétricos isentos? · Híbridos 2026? · ISV vs IUC? · IUC carro importado Alemanha? · Gratuito? |

---

#### `legalizar_carro_importado`
| Field | Value |
|---|---|
| **Title** | Legalizar Carro Importado em Portugal 2026 \| DAV, ISV, IMT \| AutoGo.pt |
| **Description** | Serviço completo de legalização de carros importados em Portugal: DAV, inspeção Modelo 112, CoC, ISV e matrícula. Prazo legal, custos e prazos explicados. AutoGo Guimarães. |
| **Keywords (19)** | legalizar carro importado, legalizar carro estrangeiro portugal, legalização carro importado portugal, legalizar carro importado portugal 2026, dav finanças veículo, declaração aduaneira veículos, coc certificado de conformidade, inspeção modelo 112, homologação imt carro importado, matrícula carro importado portugal, prazo legalizar carro importado, isenção isv mudança residência, legalizar carro alemanha portugal, custos legalização carro importado, documentos legalizar carro importado, legalizar carro, legalizar carros, isv legalização |
| **Primary** | legalizar carro importado · legalização automóvel portugal |
| **FAQs (6)** | Prazo legalização? · Consequências de não legalizar? · Conduzir antes da matrícula? · O que é a DAV? · CoC obrigatório? · Isenção ISV mudança residência? |

---

#### `viaturas`
| Field | Value |
|---|---|
| **Title** | Carros Importados em Portugal 2026 \| Stock Disponível \| AutoGo.pt |
| **Description** | Stock de carros importados legalizados em Portugal. BMW, Mercedes, Audi, VW — poupe até 8.000€ vs mercado nacional. ISV incluído. Ver disponíveis! |
| **Keywords (7)** | carros importados, carros importados portugal, carros para importar, stand carros importados, BMW importado, Mercedes importado, Audi importado |
| **Primary** | carros importados à venda · usados importados Portugal |
| **Supporting** | BMW Série 1 · Audi A3 · Mercedes Classe A · VW Golf · Peugeot 308 · Renault Mégane · Citroën C3 |

---

#### `blog`
| Field | Value |
|---|---|
| **Title** | Blog AutoGo.pt — Guias, Reviews e Notícias sobre Importação de Carros |
| **Description** | Guias completos, reviews e notícias sobre importação de carros europeus para Portugal. ISV, legalização, os melhores carros para importar em 2026. |
| **Keywords (4)** | blog importação carros, guia importar carro portugal, isv 2026, legalizar carro estrangeiro |

---

#### `como_funciona`
| Field | Value |
|---|---|
| **Title** | Importação de Carros para Portugal: Como Funciona \| AutoGo.pt |
| **Description** | Saiba como funciona a importação de carros chave-na-mão: escolha, negociação, ISV e legalização em 3–6 semanas. Processo 100% transparente. AutoGo Guimarães. |
| **Keywords (5)** | importação de carros, importar carro portugal, legalizar carro importado, processo importação automóvel, chave na mão |
| **FAQs (5)** | Serviço chave-na-mão? · Tempo do processo? · O que está incluído? · Posso pedir carro específico? · Quanto poupo? |

---

#### `contacto`
| Field | Value |
|---|---|
| **Title** | Importação Automóvel Guimarães \| AutoGo.pt \| +351 935 179 591 |
| **Description** | AutoGo em Guimarães — especialistas em importação e legalização de carros europeus. Atendimento WhatsApp disponível. Resposta em 24h. |
| **Keywords (4)** | importação automóvel guimarães, importar carros braga, AutoGo guimarães, importação carros norte portugal |

---

#### `pedido`
| Field | Value |
|---|---|
| **Title** | Pedir Importação \| Proposta Gratuita em 24h \| AutoGo.pt |
| **Description** | Peça proposta GRATUITA de importação em 24h. Indicamos o carro ideal, negociamos preço, tratamos legalização. Processo transparente, zero risco. |
| **Keywords (3)** | pedir importação carro, proposta importação automóvel, orçamento importar carro portugal |

---

#### `sobre_nos`
| Field | Value |
|---|---|
| **Title** | Sobre a AutoGo.pt \| Especialistas em Importação Automóvel, Guimarães |
| **Description** | AutoGo.pt, especialista em importação e legalização de viaturas europeias. Equipa dedicada em Guimarães. Serviço completo, 100% transparente. |
| **Keywords (3)** | sobre AutoGo, especialistas importação portugal, importação automóvel guimarães |

---

## 4. Page-by-Page Audit

### `/` — Homepage (`index.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Importar Carros da Alemanha \| Simulador ISV 2026 Grátis \| AutoGo.pt" |
| Description | ✅ | 155 chars — within limits |
| H1 | ✅ | Present |
| JSON-LD | ✅ | Custom `@graph` via `geoOptimization` + GEO HowTo schema |
| Breadcrumb | ➖ | N/A (homepage) |
| hreflang | ✅ | pt-PT, es, en, fr, de, x-default |
| Canonical | ✅ | `https://autogo.pt/` |
| OG Image | ✅ | auto-logo.png |
| FAQs visible | ✅ | Multiple FAQ items on page |
| Internal links | ✅ | Viaturas, Simulador ISV, Como Funciona, Pedido, Blog |

---

### `/simulador-isv` (`simulador-isv.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Simulador ISV 2026 GRÁTIS Portugal \| Resultado Instantâneo \| AutoGo.pt" |
| Description | ✅ | Feature-rich, 142 chars |
| H1 | ✅ | "Simule o ISV da sua viatura em segundos!" (i18n) |
| H2 | ✅ | "Simulador ISV Portugal" (inside card) |
| JSON-LD `@graph` | ✅ | **4 nodes:** `FAQPage` (GEO) + `HowTo` + `FAQPage` (detailed) + `SoftwareApplication` |
| Keywords | ✅ | 24 keywords (SIMULADOR_KEYWORDS + SEO_KEYWORDS.simulador_isv) |
| FAQs visible | ✅ | 5 accordion FAQs + 2 `<details>` |
| hreflang | ✅ | Via Seo component |
| Canonical | ✅ | `https://autogo.pt/simulador-isv` |
| Background | ✅ | simulador-fundo.webp |

---

### `/simulador-iuc` (`simulador-iuc.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Simulador IUC 2026 — Calcular IUC Grátis" (H1) |
| Meta Title | ✅ | "Simulador IUC 2026 GRÁTIS \| Calcular IUC Portugal \| AutoGo.pt" |
| Description | ✅ | Includes "nova data de pagamento IUC 2026" — trending query |
| H1 | ✅ | Updated for 2026, includes brand |
| JSON-LD `@graph` | ✅ | **4 nodes:** `SoftwareApplication` + `Service` (LocalBusiness provider) + `BreadcrumbList` + `FAQPage` (8 questions) |
| FAQs visible | ✅ | 9 accordion questions on page |
| IUC 2026 section | ✅ | "IUC 2026 — O que mudou?" amber section (3 cards) |
| Hover effects | ✅ | Cat A card, Cat B card, 3 amber cards |
| Breadcrumb | ✅ | `text-gray-900` |
| Keywords | ✅ | 26 keywords (IUC + SEO_KEYWORDS.simulador_iuc) |
| Categories covered | ✅ | Cat A (pre-2007) · Cat B (post-Jul 2007) · Elétrico isento · Gasóleo adicional · NEDC/WLTP |

---

### `/legalizar-carro-importado` (`legalizar-carro-importado.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Legalizar Carro Importado em Portugal 2026 \| DAV, ISV, IMT \| AutoGo.pt" |
| Description | ✅ | Process-specific, mentions all 4 key steps |
| H1 | ✅ | "Legalizar Carros Importados em Portugal — Serviço Completo" |
| H2s | ✅ | Processo (6 passos) · Custos · Prazos · Documentos · FAQs · CTA |
| JSON-LD `@graph` | ✅ | **3 nodes:** `Service` (LocalBusiness) + `BreadcrumbList` (3 levels) + `FAQPage` (6 questions) |
| Form (EmailJS) | ✅ | LegatizationForm with 5 fields + situação select |
| FAQs visible | ✅ | 6 accordion `<details>` |
| Hover effects | ✅ | All 6 process step cards |
| Internal links | ✅ | Importar Carros · Simulador ISV · Simulador IUC · Viaturas · Pedido |
| Cross-link | ✅ | "Ainda não importaste?" banner → `/importar-carros-portugal` |
| Breadcrumb top | ✅ | Início › Importar Carros › Legalizar Carro Importado |
| Breadcrumb bottom | ✅ | `text-gray-900` |
| "Explore mais" label | ✅ | `text-gray-900` |
| Keywords | ✅ | 19 page-specific + 14 site-wide |

---

### `/importar-carros-portugal` (`importar-carros-portugal.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | SEO-optimised for importation intent |
| JSON-LD `@graph` | ✅ | `Service` (LocalBusiness) + `BreadcrumbList` + `FAQPage` |
| FAQs visible | ✅ | Multiple |
| Internal links | ✅ | `/legalizar-carro-importado` added |
| Keywords | ✅ | `SITE_WIDE_KEYWORDS` + page-specific |

---

### `/como-funciona` (`como-funciona.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Importação de Carros para Portugal: Como Funciona \| AutoGo.pt" |
| Description | ✅ | Includes "chave-na-mão", "3–6 semanas", "Guimarães" |
| H1 | ✅ | Present |
| JSON-LD | ✅ | GEO HowTo schema (`generateGEOHowToSchema`) |
| FAQs | ✅ | 5 accordion items |
| Keywords | ✅ | COMO_FUNCIONA_KEYWORDS + SITE_WIDE_KEYWORDS + SEO_KEYWORDS |

---

### `/viaturas` (`viaturas.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Carros Importados em Portugal 2026 \| Stock Disponível \| AutoGo.pt" |
| Description | ✅ | Brand mentions + savings hook |
| Listing | ✅ | Paginated with infinite scroll (2 rows per load) |
| Filters | ✅ | Marca, Modelo, Combustível, País, Preço, Pesquisa |
| JSON-LD | ✅ | GEO FAQ schema |
| SimuladorTabela | ✅ | Lazy-loaded drawer component |
| Keywords | ✅ | VIATURAS_KEYWORDS + SITE_WIDE_KEYWORDS |

---

### `/blog` (`blog.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | "Blog AutoGo.pt — Guias, Reviews e Notícias sobre Importação de Carros" |
| Description | ✅ | Broad editorial scope |
| Categories | ✅ | /blog/categoria/noticias · /blog/categoria/reviews |
| Keywords | ✅ | BLOG_KEYWORDS + SITE_WIDE_KEYWORDS |

---

### `/contacto` (`contacto.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | Phone number in title — local SEO signal |
| Description | ✅ | Guimarães, WhatsApp, 24h |
| JSON-LD | ➖ | Falls back to global `LocalBusiness` from `Seo.tsx` |
| Keywords | ✅ | Geo-focused (Guimarães, Braga, Norte Portugal) |

---

### `/pedido` (`pedido.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | CTA-focused: "Proposta Gratuita em 24h" |
| Form | ✅ | EmailJS — 10 fields (nome, email, tel, marca/modelo, ano, orçamento, combustível, caixa, extras, mensagem + WhatsApp checkbox) |
| JSON-LD | ➖ | Falls back to global `LocalBusiness` |

---

### `/sobre-nos` (`sobre-nos.tsx`)
| Element | Status | Detail |
|---|---|---|
| Title | ✅ | Brand + geo |
| JSON-LD | ➖ | Falls back to global `LocalBusiness` |
| Scroll animation | ✅ | Red line expands edge-to-edge on scroll |

---

## 5. JSON-LD / Schema Markup — Full Inventory

### Global Fallback (all pages without custom `jsonLd`)
```
@graph [
  LocalBusiness  (full entity — address, geo, hours, sameAs, knowsAbout, hasOfferCatalog)
  WebSite        (SearchAction → /viaturas)
  FAQPage        (6 Q&As — general importation)
]
```

---

### `/simulador-isv`
```
@graph [
  FAQPage         (5 Q&As — GEO-optimised, via generateGEOFAQSchema)
  HowTo           (4 steps — how to use the simulator)
  FAQPage         (5 Q&As — detailed ISV answers)
  SoftwareApplication (FinanceApplication, free, Web)
]
```
**Total nodes:** 4 | **Total FAQs in schema:** 10

---

### `/simulador-iuc`
```
@graph [
  SoftwareApplication (FinanceApplication, IUC calculator, free)
  Service             (serviceType: "Calculadora IUC", LocalBusiness provider, address, phone)
  BreadcrumbList      (2 items: Início → Simulador IUC 2026)
  FAQPage             (8 Q&As — IUC 2026, data pagamento, elétricos, híbridos, ISV vs IUC, carro importado Alemanha)
]
```
**Total nodes:** 4 | **Total FAQs in schema:** 8

---

### `/legalizar-carro-importado`
```
@graph [
  Service        (serviceType: "Legalização Automóvel", LocalBusiness provider, address, phone, offers: free quote)
  BreadcrumbList (3 items: Início → Importar Carros → Legalizar Carro Importado)
  FAQPage        (6 Q&As — DAV, prazo, CoC, isenção ISV, conduzir antes matrícula)
]
```
**Total nodes:** 3 | **Total FAQs in schema:** 6

---

### `/importar-carros-portugal`
```
@graph [
  Service        (serviceType: "Importação Automóvel", LocalBusiness, areaServed: Portugal)
  BreadcrumbList (2 items: Início → Importar Carros Portugal)
  FAQPage        (multiple Q&As about car importation)
]
```

---

### `/como-funciona`
```
FAQPage  (via generateGEOFAQSchema — 5 process Q&As)
HowTo    (via generateGEOHowToSchema — step-by-step importation)
```

---

### Business Entity (defined in `Seo.tsx` fallback)
| Field | Value |
|---|---|
| `@type` | LocalBusiness |
| `name` | AutoGo.pt |
| `url` | https://autogo.pt |
| `telephone` | +351935179591 |
| `email` | AutoGO.stand@gmail.com |
| `foundingDate` | 2020 |
| `address` | R. Rómulo de Carvalho 388 SITIO, Guimarães, 4800-019, PT |
| `geo` | lat 41.4444, lon -8.2962 |
| `priceRange` | €€ |
| `openingHours` | Mon–Fri 09:00–18:00, Sat 09:00–13:00 |
| `areaServed` | Portugal |
| `sameAs` | facebook.com/AutoGo.pt · instagram.com/AutoGo.pt |
| `knowsAbout` | 13 topics (ISV, legalização, marcas, transporte…) |

---

## 6. Sitemap & Robots

### `sitemap.xml` — URL Count by Category
| Category | Count | Priority | changefreq |
|---|---|---|---|
| Homepage | 1 | 1.0 | daily |
| Listing (/viaturas) | 1 | 0.9 | daily |
| Tools (simuladores) | 2 | 0.9 | weekly |
| Landing pages | 2 | 0.8 | monthly |
| Service pages | 4 | 0.8 | monthly/yearly |
| Blog index | 1 | 0.8 | weekly |
| Blog categories | 2 | 0.7 | weekly |
| Blog articles | ~14 | 0.4–0.8 | monthly/yearly |
| Car detail pages | ~50+ | 0.6 | weekly |
| **Total** | **~80** | — | — |

### `robots.txt`
```
User-agent: *
Allow: /
Allow: /_next/static/
Disallow: /api/
Disallow: /_next/server/
Disallow: /_next/image?*
Disallow: /viaturas?*page=       # prevent crawl budget waste on paginated filters
Disallow: /google396d4a609845ed19.html

Sitemap: https://autogo.pt/sitemap.xml
```
✅ Correctly allows all content pages, blocks server APIs, prevents filter URL crawling.

---

## 7. Internal Linking Map

```
Homepage (/)
├── /viaturas
├── /simulador-isv
├── /como-funciona
├── /pedido
├── /blog
└── (Google Reviews component)

/viaturas
└── /cars/[slug] (each car card)
    └── SimuladorTabela drawer (inline ISV calc)

/simulador-isv
└── (no outbound internal links documented)

/simulador-iuc
├── /simulador-isv   (cross-promo)
├── /importar-carros-portugal
└── /legalizar-carro-importado

/importar-carros-portugal
├── /simulador-isv
├── /simulador-iuc
├── /legalizar-carro-importado  ← added
├── /viaturas
└── /pedido

/legalizar-carro-importado
├── /importar-carros-portugal   (hero cross-link + breadcrumb)
├── /simulador-isv              (CTA banner in Custos section)
├── /simulador-iuc
├── /viaturas
└── /pedido

/como-funciona
└── /pedido (CTA)

/blog
└── /blog/[slug] (each article)

Footer (global)
├── /                (Início)
├── /viaturas        (Viaturas)
├── /simulador-isv   (Simulador ISV)
├── /simulador-iuc   (Simulador IUC)
├── /importar-carros-portugal
├── /legalizar-carro-importado  ← added
├── /como-funciona
├── /pedido
├── /contacto
└── /sobre-nos
```

---

## 8. SEO Gaps & Recommendations

### 🔴 Critical
| Gap | Detail | Fix |
|---|---|---|
| `/sobre-nos` has no custom JSON-LD | Falls back to global — no `AboutPage` schema | Add `@type: AboutPage` with `Organization` |
| `/pedido` has no custom JSON-LD | Falls back to global | Add `@type: ContactPage` + `Service` with `Offer` |
| `/contacto` has no custom JSON-LD | Falls back to global | Add dedicated `LocalBusiness` + `ContactPage` node |
| Blog articles — JSON-LD coverage unknown | `blog/[slug].tsx` not audited | Verify `Article` schema on each post |

### 🟡 Medium Priority
| Gap | Detail | Fix |
|---|---|---|
| No `ImageObject` schema on key pages | OG image not declared in JSON-LD | Add `primaryImageOfPage` to Service/WebPage nodes |
| `/simulador-isv` H1 not keyword-optimised | H1 is i18n translated "Simule o ISV da sua viatura em segundos!" — weak for SEO | Consider a static H1 + i18n subtitle pattern |
| Car detail pages `/cars/[slug]` | No audit performed — schema unknown | Verify `Product` or `Vehicle` schema |
| `siteWide` SEO_KEYWORDS entry | Has `primary` and `supporting` but no `title`/`description`/`keywords` — not used anywhere | Clean up or remove |
| `AVOID_AS_PRIMARY` array | Defined but not enforced programmatically | Add lint rule or dev-time warning |

### 🟢 Quick Wins
| Gap | Detail | Fix |
|---|---|---|
| `/blog` page JSON-LD | No custom schema | Add `Blog` + `ItemList` schema |
| `/viaturas` | No `ItemList` schema for car listings | Add `ItemList` with `ListItem` for each car |
| `meta name="author"` | Not set anywhere | Add to `Seo.tsx` default |
| `og:locale` | Not set in `Seo.tsx` | Add `<meta property="og:locale" content="pt_PT" />` |
| Missing `lastmod` generator | `sitemap.xml` is manually maintained | Automate with `generate-sitemap.js` on build |
| `pedido` and `contacto` descriptions | Both under 120 chars — Google may rewrite | Expand to 150–160 chars |

### 📊 Keyword Coverage Matrix

| Target Query | Page | `<title>` | `<meta description>` | H1 | Schema FAQ | Keywords meta |
|---|---|---|---|---|---|---|
| simulador isv 2026 | /simulador-isv | ✅ | ✅ | ✅ | ✅ | ✅ |
| simulador iuc 2026 | /simulador-iuc | ✅ | ✅ | ✅ | ✅ | ✅ |
| calcular iuc | /simulador-iuc | ✅ | ✅ | ✅ | ✅ | ✅ |
| legalizar carro importado | /legalizar-carro-importado | ✅ | ✅ | ✅ | ✅ | ✅ |
| iuc 2026 data pagamento | /simulador-iuc | ✅ | ✅ | ➖ | ✅ | ✅ |
| importar carros alemanha | / | ✅ | ✅ | ✅ | ✅ | ✅ |
| carros importados portugal | /viaturas | ✅ | ✅ | ✅ | ✅ | ✅ |
| dav finanças veículo | /legalizar-carro-importado | ➖ | ✅ | ➖ | ✅ | ✅ |
| isenção isv mudança residência | /legalizar-carro-importado | ➖ | ➖ | ➖ | ✅ | ✅ |
| isv vs iuc | /simulador-iuc | ➖ | ➖ | ➖ | ✅ | ✅ |
| importação automóvel guimarães | /contacto | ✅ | ✅ | ➖ | ➖ | ✅ |

---

*Document last updated: 19 February 2026*


<iframe src="https://storage.googleapis.com/maps-solutions-pzck4o9vqm/locator-plus/cmtg/locator-plus.html"
  width="100%" height="100%"
  style="border:0;"
  loading="lazy">
</iframe>