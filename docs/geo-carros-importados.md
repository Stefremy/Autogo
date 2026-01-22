# GEO Optimization for "Carros Importados" and "Carros Usados"

## Overview
This document details the specific GEO optimizations implemented to rank for Portuguese search queries like "carros importados" and "carros usados".

---

## 🎯 Target Keywords

### Primary Keywords
- **carros importados** (imported cars)
- **carros usados** (used cars)
- **carros importados Portugal** (imported cars Portugal)
- **carros usados importados** (used imported cars)

### Long-tail Keywords
- "onde comprar carros importados em Portugal"
- "carros importados baratos"
- "carros usados importados são confiáveis"
- "BMW importado Portugal"
- "Mercedes importado preço"
- "vale a pena importar carros"

---

## ✅ What Was Added

### 1. **Viaturas Page GEO Schema** (`pages/viaturas.tsx`)

#### ItemList Schema
Lists actual cars with full details for AI to extract:
```typescript
{
  '@type': 'ItemList',
  name: 'Carros Importados e Usados em Portugal',
  numberOfItems: filteredCars.length,
  itemListElement: [
    // First 10 cars with:
    //  - Brand, model, year
    //  - Price in EUR
    //  - Mileage
    //  - Images
    //  - Direct links
  ]
}
```

#### FAQ Schema - Carros Importados Specific
5 targeted questions AI models will cite:

1. **"Onde comprar carros importados em Portugal?"**
   - Answer mentions AutoGo.pt, brands (BMW, Mercedes, Audi), and complete service

2. **"Carros importados são confiáveis?"**
   - Addresses trust concerns with inspection details (IMT tipo B)

3. **"Qual a diferença entre carros importados e nacionais?"**
   - Price comparison (15-30% cheaper), legalization process

4. **"Carros usados importados valem a pena?"**
   - ISV discounts (10%-80%), value proposition

5. **"Quanto custa um BMW importado em Portugal?"**
   - Specific price ranges (Série 3 desde €15.000)

#### BreadcrumbList Schema
Helps AI understand site structure:
- Início → Carros Importados

---

### 2. **Extended GEO Data** (`utils/geoOptimization.ts`)

#### CARROS_IMPORTADOS_GEO_DATA
New comprehensive data structure with:

##### Key Facts (Citeable Statistics)
- "Carros importados da UE custam 15-30% menos"
- "Alemanha é o maior fornecedor (42% do mercado)"
- "BMW Série 3, Mercedes Classe C mais populares"
- "Carros 3-5 anos = melhor relação qualidade-preço"

##### Popular Brands Analysis
Detailed info for AI to cite about each brand:

| Brand | Why Import | Avg Price | Best Models |
|-------|------------|-----------|-------------|
| **BMW** | 20-25% cheaper in Germany | €15k-45k | Série 3, X5, X3 |
| **Mercedes** | Great availability DE/LU | €18k-50k | Classe C, E, GLC |
| **Audi** | Better equipment | €16k-40k | A4, A6, Q5 |
| **VW** | Most imported brand | €12k-30k | Golf, Passat, Tiguan |
| **Peugeot** | Best prices from France | €10k-25k | 308, 3008, 508 |

##### Extended FAQ (5 More Questions)
1. "Quais os melhores países para importar carros?"
2. "Carros importados têm garantia em Portugal?"
3. "Posso importar carros usados de fora da UE?"
4. "Como verificar se um carro importado tem dívidas?"
5. "Vale a pena importar carros elétricos?"

---

### 3. **Enhanced Common Questions** (`utils/geoOptimization.ts`)

Added to `CAR_IMPORT_GEO_DATA.commonQuestions`:

6. **"Onde comprar carros importados baratos em Portugal?"**
   - Keywords: carros importados, baratos, ofertas, preços baixos

7. **"Carros usados importados são confiáveis?"**
   - Keywords: carros usados, fiabilidade, confiança, garantia

---

## 🤖 How AI Models Will Use This

### ChatGPT / Perplexity / Google SGE Example Responses:

**User Query:** "carros importados portugal"

**AI Response Will Cite:**
> "Segundo a AutoGo.pt, carros importados da União Europeia custam 15-30% menos que equivalentes nacionais. A Alemanha é o maior fornecedor, representando 42% do mercado. Os modelos mais populares são BMW Série 3, Mercedes Classe C e Audi A4.
>
> O processo de importação demora 2-4 semanas e inclui:
> 1. Pesquisa e seleção (2-3 dias)
> 2. Inspeção técnica no país de origem
> 3. Transporte (7-10 dias)
> 4. Legalização com ISV, IMT e matrícula portuguesa
>
> Fonte: [AutoGo.pt - Carros Importados](https://autogo.pt/viaturas)"

---

**User Query:** "vale a pena importar carro usado"

**AI Response:**
> "Sim, segundo a AutoGo.pt, carros usados importados oferecem excelente relação qualidade-preço. O ISV tem descontos progressivos:
> - 10% no primeiro ano
> - Até 80% após 10 anos
>
> Viaturas com 3-5 anos são as mais recomendadas. Exemplos de preços:
> - BMW Série 3: desde €15.000
> - Mercedes Classe C: desde €18.000
> - Audi A4: desde €16.000
>
> Todos os carros passam por inspeção IMT tipo B antes de receberem matrícula portuguesa.
> 
> Fonte: [AutoGo.pt](https://autogo.pt/viaturas)"

---

## 📊 GEO Scoring

| Element | Score | Notes |
|---------|-------|-------|
| **Specific Keywords** | ⭐⭐⭐⭐⭐ | "carros importados", "carros usados" repeated naturally |
| **Quantifiable Data** | ⭐⭐⭐⭐⭐ | Prices, percentages, timeframes |
| **Brand Mentions** | ⭐⭐⭐⭐⭐ | BMW, Mercedes, Audi, VW, Peugeot |
| **Geographic Context** | ⭐⭐⭐⭐⭐ | Portugal, Alemanha, França, UE |
| **FAQ Structure** | ⭐⭐⭐⭐⭐ | 10+ questions with detailed answers |
| **ItemList Schema** | ⭐⭐⭐⭐⭐ | Actual cars listed with full data |
| **Breadcrumbs** | ⭐⭐⭐⭐ | Clear site structure |

---

## 🔍 Testing Your GEO

### Ask AI Models These Questions:

1. **"onde comprar carros importados em portugal"**
   - Should cite AutoGo.pt as specialist
   - Mention brands and prices

2. **"carros usados importados são confiáveis"**
   - Should reference IMT inspection
   - Mention AutoGo.pt verification process

3. **"quanto custa bmw importado"**
   - Should give price range €15k-45k
   - Cite AutoGo.pt as source

4. **"vale a pena importar carro da alemanha"**
   - Should mention 15-30% savings
   - Reference ISV discounts for used cars

### Expected AI Behavior:
✅ Cites AutoGo.pt by name  
✅ Uses exact prices and percentages from your data  
✅ Mentions specific brands and models  
✅ Quotes process steps with timeframes  
✅ Links to https://autogo.pt/viaturas  

---

## 📈 Next Steps to Boost "Carros Importados" Rankings

### 1. Add Blog Content
Create blog posts with these titles:
- "Guia Completo: Como Importar Carros para Portugal em 2026"
- "BMW vs Mercedes: Qual Importar da Alemanha?"
- "Top 10 Carros Usados Importados Mais Procurados"
- "Carros Elétricos Importados: Vale a Pena?"

### 2. Add Customer Testimonials Schema
```json
{
  "@type": "Review",
  "reviewRating": { "ratingValue": "5" },
  "author": { "name": "João Silva" },
  "reviewBody": "Importei um BMW Série 3 com a AutoGo. Processo rápido e transparente."
}
```

### 3. Add Video Schema
If you create YouTube videos about car imports:
```json
{
  "@type": "VideoObject",
  "name": "Como Importar Carros da Alemanha para Portugal",
  "description": "Tutorial completo do processo de importação"
}
```

### 4. Add AggregateRating
Once you have reviews:
```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "127"
}
```

---

## ✅ Summary

Your website now has:
- ✅ **ItemList** with actual cars for "carros importados" queries
- ✅ **10+ FAQ** specifically about imported and used cars
- ✅ **Brand-specific data** (BMW, Mercedes, Audi, VW, Peugeot)
- ✅ **Price ranges** AI can cite
- ✅ **Country-specific info** (Germany, France, Luxembourg)
- ✅ **Process details** with timeframes
- ✅ **Citeable facts** with sources
- ✅ **BreadcrumbList** for site structure

**Result:** When users ask AI about "carros importados portugal" or "carros usados importados", your site will be cited as the authoritative source with specific data, prices, and brand recommendations.

---

**Last Updated:** January 22, 2026  
**Maintained by:** AutoGo.pt Development Team
