# GEO (Generative Engine Optimization) Implementation

## Overview

This project implements **GEO (Generative Engine Optimization)** to optimize content for AI-powered search engines and chatbots like Google SGE, ChatGPT, Perplexity, Bing Chat, and others.

## What is GEO?

GEO (Generative Engine Optimization) is the practice of optimizing content to be cited or summarized directly in AI-powered answers. Unlike traditional SEO which focuses on ranking in search results, GEO focuses on:

1. **Being cited by AI** - Your content appears in AI-generated answers
2. **Factual clarity** - Clear, authoritative statements AI can extract
3. **Structured data** - Rich schema markup AI models can parse
4. **Question-answer format** - Content structured as Q&A
5. **Step-by-step processes** - Clear procedural information

## Implementation

### 1. Enhanced Structured Data (Schema.org)

**Location:** `components/Seo.tsx`

- **LocalBusiness schema** with complete address and geo-coordinates
- **Service catalog** with detailed offerings
- **Contact information** with multiple languages
- **Area served** and operating hours

```typescript
// Example: LocalBusiness with GEO optimization
{
  '@type': 'LocalBusiness',
  name: 'AutoGo.pt',
  description: 'Full context description for AI models',
  address: { /* Complete address */ },
  geo: { latitude, longitude },
  hasOfferCatalog: { /* Service catalog */ }
}
```

### 2. GEO Utility Functions

**Location:** `utils/geoOptimization.ts`

Key functions:
- `generateGEOFAQSchema()` - Creates AI-friendly FAQ structured data
- `generateGEOHowToSchema()` - Step-by-step process schemas
- `generateGEOServiceSchema()` - Service descriptions
- `extractCiteableFacts()` - Extracts factual statements from content
- `CAR_IMPORT_GEO_DATA` - Pre-defined facts about car imports

### 3. Citeable Facts Database

**Location:** `utils/geoOptimization.ts`

Contains verified facts that AI models can cite:

```typescript
keyFacts: [
  {
    fact: 'Veículos elétricos estão isentos de ISV em Portugal',
    category: 'Impostos',
    confidence: 'high',
    source: 'Decreto-Lei',
  },
  // ... more facts
]
```

### 4. GEO Facts Component

**Location:** `components/GEOFacts.tsx`

Visual component displaying facts in a structured, AI-parseable format:
- Schema.org Claim markup
- Clear, factual statements
- Source attribution
- Visual hierarchy

## Pages with GEO Optimization

### Homepage (`pages/index.tsx`)
- ✅ FAQ schema with detailed answers
- ✅ HowTo schema for import process
- ✅ Combined JSON-LD graph

### Simulator (`pages/simulador.tsx`)
- ✅ Enhanced FAQ with keywords
- ✅ SoftwareApplication schema
- ✅ Detailed ISV calculation explanations

### Como Funciona (`pages/como-funciona.tsx`)
- ✅ Service schema with pricing
- ✅ Step-by-step HowTo schema
- ✅ Process duration information

## GEO Content Principles

### 1. Factual Clarity
❌ **Bad:** "Nós somos os melhores na importação"
✅ **Good:** "O processo de importação demora entre 2-4 semanas, incluindo transporte e legalização"

### 2. Structured Information
❌ **Bad:** Paragraph of mixed information
✅ **Good:** 
- Step 1: Pesquisa (2-3 dias)
- Step 2: Inspeção (1 dia)
- Step 3: Transporte (7-10 dias)

### 3. Quantifiable Data
❌ **Bad:** "Custos razoáveis"
✅ **Good:** "Custos de legalização: ISV (variável) + IMT (€195) + inspeção (€50-€100)"

### 4. Question-Answer Format
```typescript
{
  question: "Quanto custa importar um carro para Portugal?",
  answer: "O custo depende do ISV (baseado em cilindrada e CO2), transporte (€500-€1500), legalização (€195-€500) e preço do veículo.",
  keywords: ['custo', 'preço', 'importação']
}
```

## Testing GEO Optimization

### 1. Ask AI Models
Test your content by asking AI assistants:
- "Como importar um carro para Portugal?"
- "Quanto custa o ISV de um carro importado?"
- "Quais os passos para legalizar uma viatura?"

### 2. Check Citations
Verify if AI models cite your website:
- Look for "According to AutoGo.pt..."
- Check if facts are quoted accurately
- Verify step-by-step processes are preserved

### 3. Structured Data Validation
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validate Schema.org markup
- Check JSON-LD syntax

## Best Practices

### Content Writing for GEO

1. **Start with the answer** - Put the key fact first
2. **Be specific** - Use exact numbers, dates, and sources
3. **Use lists** - Bulleted or numbered lists are AI-friendly
4. **Define terms** - Explain acronyms (ISV, IMT, etc.)
5. **Include context** - Location, time frames, applicable conditions

### Schema Markup for GEO

1. **Use @graph** - Combine multiple schemas
2. **Add descriptions** - Every entity needs context
3. **Include keywords** - Help AI understand topic relevance
4. **Link entities** - Use @id to connect related data
5. **Provide alternatives** - alternateName, sameAs links

### Technical Implementation

1. **Server-side rendering** - Ensure schemas load before AI crawls
2. **Valid JSON-LD** - Test with validators
3. **Semantic HTML** - Use proper heading hierarchy
4. **Microdata attributes** - itemScope, itemProp for inline markup
5. **Accessible content** - Clear structure helps both AI and users

## Monitoring GEO Performance

### Metrics to Track

1. **AI citations** - How often your site is referenced
2. **Featured snippets** - Appearing in Google's answer boxes
3. **Voice search results** - Being read by voice assistants
4. **Brand mentions** - AI referring to AutoGo.pt by name
5. **Traffic from AI** - Referrals from AI platforms

### Tools

- Google Search Console - Featured snippets
- ChatGPT plugins - Direct citations
- Perplexity Pro - Source tracking
- Bing Webmaster Tools - AI search insights

## Future Enhancements

- [ ] Add BreadcrumbList schema for navigation
- [ ] Implement Video schema for tutorials
- [ ] Create Product schema for individual cars
- [ ] Add Review schema for customer testimonials
- [ ] Implement Event schema for promotions
- [ ] Add SpeakableSpecification for voice search

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [GEO Best Practices (2025)](https://www.semrush.com/blog/generative-engine-optimization/)
- [AI-First SEO Guide](https://moz.com/blog/ai-seo)

## Contact

For questions about GEO implementation:
- Email: AutoGO.stand@gmail.com
- Website: https://autogo.pt

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Maintained by:** AutoGo.pt Development Team
