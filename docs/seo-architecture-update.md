# AutoGo.pt SEO Architecture Updates

This document summarizes the structural SEO work introduced in the latest iteration of the codebase and explains the rationale behind each change.

## 1. Dynamic sitemap generation (`scripts/generate-sitemap.js`)

### What changed
- Replaced the previous simplistic sitemap builder with a generator that:
  - Pulls the canonical site origin from `SITEMAP_BASE_URL` (defaulting to `https://autogo.pt`) and normalizes trailing slashes.
  - Calculates `<lastmod>` dates by combining file modification times and front‑matter metadata instead of using a single build timestamp.
  - Registers the main navigation routes (home, inventory, blog, institutional pages, simulator, privacy documents, etc.) with tailored `changefreq`/`priority` hints.
  - Emits every published blog post and every car detail page (`/cars/<slug>`) with their own freshness signals.
  - Detects blog post "type" values (`news` or `review`) to generate aggregate category URLs under `/blog/categoria/<categoria>` and assigns them the latest post date in that bucket.
  - Writes the compiled XML sitemap directly to `public/sitemap.xml`.

### Why it was done
- **Reflect real content updates**: Accurate `lastmod` values help search engines understand which listings and articles were updated recently, prioritizing fresh inventory and edits.
- **Expose the complete crawlable surface**: Including static hubs, vehicle detail pages, and blog content ensures that no important landing pages remain orphaned from discovery.
- **Align with the agreed information architecture**: Surfacing category landing pages in the sitemap mirrors the navigation hierarchy requested for AutoGo.pt and prepares the ground for future sitemap splitting when the catalog grows.

## 2. Blog category experience (`pages/blog.tsx`, `pages/blog/categoria/[category].tsx`)

### What changed
- Enriched the blog index with a "Categorias em destaque" block linking to Notícias and Reviews, mirroring the sitemap categories.
- Added a dedicated dynamic route for `/blog/categoria/[category]` that:
  - Validates the requested category (`noticias` or `reviews`).
  - Builds tailored SEO metadata (title, description, keywords, canonical URL).
  - Lists only the posts whose front‑matter `type` matches the category, ordered by publish date.
  - Reuses the blog visual language (hero underline effect, card layout) for continuity and user familiarity.

### Why it was done
- **Strengthen internal linking**: Highlighting category hubs from the blog home reduces click depth and supports the crawl paths declared in the sitemap.
- **Improve topical authority**: Grouping posts by type helps search engines understand content silos (news vs. reviews) and increases relevance for topic-specific queries.
- **Give visitors curated entry points**: Readers can jump straight to the content format they prefer, improving navigation and engagement metrics.

## 3. Robots directives (`public/robots.txt`)

### What changed
- Clarified the robots policy by allowing global crawl access while explicitly disallowing internal Next.js and API paths.
- Pointed crawlers to the canonical sitemap URL (`https://autogo.pt/sitemap.xml`).

### Why it was done
- **Ensure sitemap discovery**: Declaring the sitemap inside `robots.txt` is a standard hint that increases the chance of timely indexing.
- **Avoid wasting crawl budget**: Blocking `_next/` and `/api/` prevents transient build artifacts and serverless endpoints from polluting the crawl space while keeping public pages indexable.

## 4. Sitemap language scope

### What changed
- Removed alternate-language (`hreflang`) entries from the sitemap output so that only the Portuguese canonical URLs are emitted.

### Why it was done
- **Match the single-language requirement**: The project currently serves one locale publicly; removing unused alternates avoids confusing search engines with non-existent translations.

---

These updates collectively implement the sitemap structure, robots policy, and navigational reinforcements discussed during the SEO planning phase, positioning AutoGo.pt for faster and more accurate indexing of its inventory and editorial content.
