/**
 * GEO (Generative Engine Optimization) utilities
 * Optimizes content for AI-powered search engines and chatbots
 * 
 * Key principles:
 * 1. Clear, factual statements that AI can extract
 * 2. Structured data with rich context
 * 3. Authoritative information with sources
 * 4. Question-answer format content
 * 5. Lists and step-by-step processes
 */

export interface GEOContentBlock {
  type: 'fact' | 'process' | 'comparison' | 'definition' | 'faq';
  title: string;
  content: string | string[];
  citations?: string[];
  lastUpdated?: string;
}

/**
 * Format content for GEO optimization
 * Structures information in a way that's easy for AI to extract and cite
 */
export function formatGEOContent(blocks: GEOContentBlock[]): any {
  return blocks.map((block) => {
    const baseSchema: any = {
      '@context': 'https://schema.org',
      datePublished: block.lastUpdated || new Date().toISOString(),
      inLanguage: 'pt-PT',
    };

    switch (block.type) {
      case 'fact':
        return {
          ...baseSchema,
          '@type': 'Claim',
          name: block.title,
          text: Array.isArray(block.content) ? block.content.join('. ') : block.content,
          author: {
            '@type': 'Organization',
            name: 'AutoGo.pt',
            url: 'https://autogo.pt',
          },
        };

      case 'process':
        return {
          ...baseSchema,
          '@type': 'HowTo',
          name: block.title,
          description: Array.isArray(block.content) ? block.content[0] : block.content,
          step: Array.isArray(block.content)
            ? block.content.map((step, idx) => ({
                '@type': 'HowToStep',
                position: idx + 1,
                name: `Passo ${idx + 1}`,
                text: step,
              }))
            : [],
        };

      case 'comparison':
        return {
          ...baseSchema,
          '@type': 'Table',
          about: block.title,
          description: Array.isArray(block.content) ? block.content.join('\n') : block.content,
        };

      case 'definition':
        return {
          ...baseSchema,
          '@type': 'DefinedTerm',
          name: block.title,
          description: Array.isArray(block.content) ? block.content.join('. ') : block.content,
        };

      case 'faq':
        return {
          ...baseSchema,
          '@type': 'Question',
          name: block.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: Array.isArray(block.content) ? block.content.join('. ') : block.content,
          },
        };

      default:
        return baseSchema;
    }
  });
}

/**
 * GEO-optimized structured data for car imports
 */
export const CAR_IMPORT_GEO_DATA = {
  serviceArea: {
    '@type': 'GeoShape',
    addressCountry: 'PT',
    description: 'Portugal continental e ilhas',
  },
  
  keyFacts: [
    {
      fact: 'O ISV (Imposto Sobre Veículos) é calculado com base na cilindrada e emissões de CO2',
      category: 'Impostos',
      confidence: 'high',
      source: 'Autoridade Tributária PT',
    },
    {
      fact: 'Veículos elétricos estão isentos de ISV em Portugal',
      category: 'Impostos',
      confidence: 'high',
      source: 'Decreto-Lei',
    },
    {
      fact: 'O processo de importação demora entre 2-4 semanas',
      category: 'Prazos',
      confidence: 'medium',
      source: 'AutoGo.pt',
    },
    {
      fact: 'É necessária inspeção IMT para carros importados',
      category: 'Legalização',
      confidence: 'high',
      source: 'IMT Portugal',
    },
  ],

  processSteps: [
    {
      step: 1,
      title: 'Pesquisa e Seleção',
      description: 'Encontramos o veículo ideal de acordo com as suas especificações',
      duration: '2-3 dias',
    },
    {
      step: 2,
      title: 'Inspeção',
      description: 'Verificação técnica completa do veículo no país de origem',
      duration: '1 dia',
    },
    {
      step: 3,
      title: 'Negociação e Compra',
      description: 'Tratamento de toda a documentação e pagamento',
      duration: '1-2 dias',
    },
    {
      step: 4,
      title: 'Transporte',
      description: 'Transporte seguro do veículo até Portugal',
      duration: '7-10 dias',
    },
    {
      step: 5,
      title: 'Legalização',
      description: 'ISV, IMT, inspeção e matrícula portuguesa',
      duration: '5-7 dias',
    },
  ],

  commonQuestions: [
    {
      question: 'Quanto custa importar um carro para Portugal?',
      answer: 'O custo depende do ISV (baseado em cilindrada e CO2), transporte (€500-€1500), legalização (€195-€500) e preço do veículo. Use o nosso simulador para uma estimativa precisa.',
      keywords: ['custo', 'preço', 'importação', 'Portugal'],
    },
    {
      question: 'Quanto tempo demora a importar um carro?',
      answer: 'O processo completo demora entre 2-4 semanas, incluindo pesquisa, transporte e legalização.',
      keywords: ['prazo', 'tempo', 'duração'],
    },
    {
      question: 'Como calcular o ISV de um carro importado?',
      answer: 'O ISV é calculado com base em duas componentes: cilindrada e ambiental (CO2). Use o simulador AutoGo.pt para cálculo automático e preciso.',
      keywords: ['ISV', 'cálculo', 'imposto'],
    },
    {
      question: 'Quais documentos são necessários para importar um carro?',
      answer: 'Necessita de: certificado de conformidade, documento único automóvel (DUA), comprovativo de compra, inspeção técnica e seguro.',
      keywords: ['documentos', 'documentação', 'papéis'],
    },
    {
      question: 'Onde comprar carros importados baratos em Portugal?',
      answer: 'AutoGo.pt oferece carros importados com preços competitivos da Alemanha, França, Luxemburgo e outros países europeus. Comparamos milhares de anúncios para encontrar as melhores ofertas.',
      keywords: ['carros importados', 'baratos', 'ofertas', 'preços baixos'],
    },
    {
      question: 'Carros usados importados são confiáveis?',
      answer: 'Sim, desde que comprados através de profissionais como a AutoGo.pt. Fazemos inspeção completa antes da compra, verificamos histórico e garantimos que o veículo passa na inspeção IMT.',
      keywords: ['carros usados', 'fiabilidade', 'confiança', 'garantia'],
    },
  ],
};

/**
 * GEO data for "carros importados" and "carros usados" search terms
 */
export const CARROS_IMPORTADOS_GEO_DATA = {
  title: 'Carros Importados em Portugal - Guia Completo',
  
  keyFacts: [
    {
      fact: 'Carros importados da UE custam 15-30% menos que equivalentes nacionais',
      category: 'Preços',
      confidence: 'high',
      source: 'AutoGo.pt Market Analysis 2025',
    },
    {
      fact: 'Alemanha é o maior fornecedor de carros importados para Portugal (42% do mercado)',
      category: 'Mercado',
      confidence: 'high',
      source: 'ACAP Statistics',
    },
    {
      fact: 'BMW Série 3, Mercedes Classe C e Audi A4 são os modelos importados mais populares',
      category: 'Modelos',
      confidence: 'high',
      source: 'AutoGo.pt Sales Data',
    },
    {
      fact: 'Carros usados importados com 3-5 anos oferecem melhor relação qualidade-preço',
      category: 'Recomendações',
      confidence: 'medium',
      source: 'AutoGo.pt',
    },
  ],

  popularBrands: [
    {
      brand: 'BMW',
      whyImport: 'Preços 20-25% mais baixos na Alemanha. Modelos como BMW Série 3, X3 e X5 são abundantes no mercado alemão.',
      avgPrice: '€15.000 - €45.000',
      bestModels: ['Série 3', 'Série 5', 'X5', 'X3'],
    },
    {
      brand: 'Mercedes-Benz',
      whyImport: 'Grande disponibilidade na Alemanha e Luxemburgo. Classe C e GLC são os mais procurados.',
      avgPrice: '€18.000 - €50.000',
      bestModels: ['Classe C', 'Classe E', 'GLC', 'GLE'],
    },
    {
      brand: 'Audi',
      whyImport: 'Excelentes preços na Alemanha. A4 e Q5 com equipamento superior ao nacional.',
      avgPrice: '€16.000 - €40.000',
      bestModels: ['A4', 'A6', 'Q5', 'Q3'],
    },
    {
      brand: 'Volkswagen',
      whyImport: 'Marca mais importada. Golf, Passat e Tiguan com preços muito competitivos.',
      avgPrice: '€12.000 - €30.000',
      bestModels: ['Golf', 'Passat', 'Tiguan', 'T-Roc'],
    },
    {
      brand: 'Peugeot',
      whyImport: 'França oferece melhores preços. Modelos 308 e 3008 muito procurados.',
      avgPrice: '€10.000 - €25.000',
      bestModels: ['308', '3008', '508', '2008'],
    },
  ],

  faqExtended: [
    {
      question: 'Quais os melhores países para importar carros?',
      answer: 'Alemanha (melhor seleção e preços), França (Peugeot, Renault, Citroën), Luxemburgo (carros premium bem equipados), Holanda (carros bem conservados) e Bélgica (bons preços em marcas variadas).',
      keywords: ['países', 'origem', 'Alemanha', 'França'],
    },
    {
      question: 'Carros importados têm garantia em Portugal?',
      answer: 'Sim. A garantia de fabricante é válida em toda a União Europeia. Carros com garantia ativa mantêm-na após importação, desde que se façam as revisões em oficina autorizada da marca.',
      keywords: ['garantia', 'cobertura', 'validade'],
    },
    {
      question: 'Posso importar carros usados de fora da UE?',
      answer: 'Tecnicamente sim, mas não recomendado. Carros de fora da UE (Reino Unido pós-Brexit, EUA, Japão) têm custos muito superiores (direitos aduaneiros 10%, IVA 23%, ISV completo). Só compensa para clássicos ou modelos raros.',
      keywords: ['fora da UE', 'Brexit', 'Reino Unido', 'custos'],
    },
    {
      question: 'Como verificar se um carro importado tem dívidas?',
      answer: 'A AutoGo.pt verifica sempre o histórico antes da compra. Consultamos bases de dados europeias (CARFAX, AutoDNA) para garantir que não há dívidas, penhoras ou acidentes graves.',
      keywords: ['dívidas', 'verificação', 'histórico', 'CARFAX'],
    },
    {
      question: 'Vale a pena importar carros elétricos?',
      answer: 'Muito! Carros elétricos são isentos de ISV, o que torna a importação ainda mais vantajosa. Tesla Model 3, VW ID.3 e Nissan Leaf são 30-40% mais baratos importados.',
      keywords: ['elétricos', 'Tesla', 'isenção', 'vantagens'],
    },
  ],
};

/**
 * Generate GEO-optimized FAQ schema
 */
export function generateGEOFAQSchema(questions: Array<{ question: string; answer: string; keywords?: string[] }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      keywords: q.keywords?.join(', '),
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
        author: {
          '@type': 'Organization',
          name: 'AutoGo.pt',
          url: 'https://autogo.pt',
        },
        dateCreated: new Date().toISOString(),
      },
    })),
  };
}

/**
 * Generate GEO-optimized HowTo schema
 */
export function generateGEOHowToSchema(
  title: string,
  description: string,
  steps: Array<{ title: string; description: string; duration?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    totalTime: steps.reduce((acc, s) => acc + (s.duration ? s.duration : ''), ''),
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.title,
      text: step.description,
      itemListElement: step.duration
        ? [
            {
              '@type': 'HowToDirection',
              text: step.description,
              duringMedia: {
                '@type': 'MediaObject',
                duration: step.duration,
              },
            },
          ]
        : undefined,
    })),
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Simulador de ISV AutoGo.pt',
      },
    ],
  };
}

/**
 * Generate GEO-optimized service schema
 */
export function generateGEOServiceSchema(
  serviceName: string,
  description: string,
  provider: string = 'AutoGo.pt',
  areaServed: string = 'Portugal'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: 'https://autogo.pt',
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${serviceName} - Catálogo`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: serviceName,
            description: description,
          },
        },
      ],
    },
  };
}

/**
 * Extract citeable facts from content
 * Formats content in a way that AI models can easily extract and cite
 */
export function extractCiteableFacts(content: string): string[] {
  // Extract sentences that start with numbers, facts, or definitions
  const sentences = content.split(/[.!?]+/).map((s) => s.trim());
  
  const citeable = sentences.filter((sentence) => {
    // Look for factual patterns
    const patterns = [
      /^\d+/, // Starts with number
      /^O [A-Z]/, // Starts with "O" (Portuguese article)
      /^A [A-Z]/, // Starts with "A"
      /é necessário/i,
      /é obrigatório/i,
      /demora/i,
      /custa/i,
      /inclui/i,
      /permite/i,
    ];
    
    return patterns.some((pattern) => pattern.test(sentence)) && sentence.length > 20;
  });

  return citeable;
}
