// Centralized SEO keyword lists for consistent meta keywords across pages.
export const SITE_WIDE_KEYWORDS = [
  "carros importados",
  "carros europeus",
  "carros usados",
  "carros seminovos europeus",
  "carros em segunda mão",
  "AutoGo.pt",
  // ✅ TIER1 — alto volume
  "isv",
  "isv 2026",
  "legalizar carros",
  // ✅ IUC — maior lacuna
  "simulador iuc",
  "simulador iuc 2026",
  "iuc calculadora",
];

// ─── Keyword pools by tier (exportados para uso granular) ────────────────────

export const TIER1_KEYWORDS = [
  "isv",
  "isv 2026",
  "legalizar carros",
];

export const TIER2_KEYWORDS = [
  "legalizar carro estrangeiro",
  "carros para importar",
  "comprar carro alemanha",
];

export const TIER3_KEYWORDS = [
  "importar carros usados",
  "importar carros elétricos",
];

export const IUC_KEYWORDS = [
  "simulador iuc",
  "simulador iuc 2026",
  "iuc calculadora",
  "simulador legalização auto",
  "simulador legalização automóvel",
];

export const GEO_KEYWORDS = [
  "importação automóvel guimarães",
  "importar carros braga",
  "importação carros norte portugal",
];

export const CONTENT_KEYWORDS = [
  "isv vs iuc",
  "documentos legalizar carro importado",
  "melhores stands alemanha",
  "custos importar carro usado",
  "isenção isv elétricos",
];

export const HOME_KEYWORDS = [
  "importar carros",
  "importar carros da alemanha",
  "importação de carros",
  "simulador isv",
  "carros importados portugal",
  "legalização automóvel",
  "carros importados",
  "carros usados Portugal",
  "carros importados baratos",
  "carros BMW importados",
  "Audi importado",
  "Mercedes importado",
  "carros europeus",
  "viaturas importadas",
  "AutoGo.pt",
  // ✅ TIER1 — alto volume
  "legalizar carros",
  "isv",
  // ✅ GEO — Guimarães/Braga
  "importação automóvel guimarães",
  "importar carros braga",
  "importação carros norte portugal",
];

export const VIATURAS_KEYWORDS = [
  "carros importados",
  "carros importados portugal",
  "carros para importar",
  "stand carros importados",
  "BMW importado",
  "Mercedes importado",
  "Audi importado",
  "carros usados Portugal",
  "carros importados baratos",
  "carros europeus",
  "carros BMW usados",
  "Audi usados",
  "Mercedes usados",
  "Volkswagen usados",
  "Renault usados",
  "Citroën usados",
  "carros importados à venda",
  "viaturas importadas",
  "carros seminovos europeus",
  "carros segunda mão importados",
  // ✅ TIER2 + TIER3
  "importar carros usados",
  "comprar carro alemanha",
  "importar carros elétricos",
];

export const BLOG_KEYWORDS = [
  "blog importação carros",
  "guia importar carro portugal",
  "isv 2026",
  "legalizar carro estrangeiro",
  "carros europeus",
  "carros importados Portugal",
  "carros usados europeus",
  "reviews de carros",
  "notícias automóveis",
  "importar carro da Alemanha",
  "como legalizar carro importado",
  // ✅ CONTENT informacional
  "isv vs iuc",
  "importar carros elétricos",
  "documentos legalizar carro importado",
  "custos importar carro usado",
  "isenção isv elétricos",
];

export const SIMULADOR_KEYWORDS = [
  "simulador isv",
  "isv simulador",
  "isv simulador 2026",
  "calcular isv portugal",
  "tabela isv 2026",
  "simulador isv 2026",
  "isv",
  "ISV Portugal",
  "cálculo ISV",
  "importar carro Portugal",
  "legalização viaturas",
  // ✅ IUC — maior lacuna (~18K vol/mês)
  "simulador iuc",
  "simulador iuc 2026",
  "iuc calculadora",
  "simulador legalização auto",
  "simulador legalização automóvel",
];

export const ABOUT_KEYWORDS = [
  "sobre AutoGo",
  "especialistas importação portugal",
  "importação automóvel guimarães",
  "AutoGo.pt",
  "importar carro Portugal",
  "equipa AutoGo",
  "Quem somos",
];

export const COMO_FUNCIONA_KEYWORDS = [
  "importação de carros",
  "importar carro portugal",
  "legalizar carro importado",
  "processo importação automóvel",
  "chave na mão",
  "legalização viaturas",
  "importação de viaturas",
  // ✅ TIER2 — quick wins
  "legalizar carro estrangeiro",
  "carros para importar",
  "comprar carro alemanha",
];

export function joinKeywords(...lists: string[][]) {
  const merged: string[] = [];
  for (const l of lists) {
    for (const k of l) if (k && !merged.includes(k)) merged.push(k);
  }
  return merged.join(", ");
}

export type SEOSet = {
  title?: string;
  description?: string;
  primary: string[];
  supporting?: string[];
  keywords?: string[];
  faq?: string[];
};

export const SEO_KEYWORDS: Record<string, SEOSet> = {
  siteWide: {
    primary: ["AutoGo", "importação de viaturas"],
    supporting: [
      "importar carro para Portugal",
      "legalização de carros",
      "ISV (Imposto sobre Veículos)",
      "atribuição de matrícula",
      "IMT homologação",
      "inspeção tipo B",
    ],
  },

  home: {
    title: 'Importar Carros da Alemanha | Simulador ISV 2026 Grátis | AutoGo.pt',
    description: 'Importe o seu carro da Europa com tudo incluído — ISV, legalização e entrega em Portugal. Poupe até 7.000€. Simulador ISV grátis. Guimarães.',
    keywords: ['importar carros', 'importar carros da alemanha', 'importação de carros', 'simulador isv', 'carros importados portugal', 'legalização automóvel', 'AutoGo.pt'],
    primary: ["importar carro para Portugal", "importação de viaturas"],
    supporting: [
      "carros importados Portugal",
      "legalização de carros",
      "custos ISV",
      "transporte e legalização",
      "processo de importação de carros",
      "carros europeus usados",
    ],
    faq: [
      "Quanto custa importar um carro para Portugal?",
      "Que documentos preciso para a atribuição de matrícula?",
      "Como funciona o ISV para carros usados importados?",
    ],
  },

  simulador_isv: {
    title: 'Simulador ISV 2026 GRÁTIS Portugal | Resultado Instantâneo | AutoGo.pt',
    description: 'Calcule o ISV em segundos — o simulador mais preciso de Portugal. Grátis, sem registo, atualizado 2026. Carros novos, usados e elétricos. AutoGo.pt',
    keywords: ['simulador isv', 'isv simulador', 'isv simulador 2026', 'calcular isv portugal', 'tabela isv 2026', 'simulador isv 2026', 'isv'],
    primary: ["Simulador ISV", "calcular ISV"],
    supporting: [
      "tabela ISV 2026",
      "simulador imposto sobre veículos",
      "ISV WLTP emissões CO₂",
      "ISV carros usados",
      "ISV híbridos e elétricos",
      "ISV importados UE",
    ],
    faq: [
      "Como calcular o ISV passo a passo?",
      "Que dados preciso (cilindrada, CO₂, combustível)?",
      "Como pedir isenção de ISV por mudança de residência?",
    ],
  },

  viaturas: {
    title: 'Carros Importados em Portugal 2026 | Stock Disponível | AutoGo.pt',
    description: 'Stock de carros importados legalizados em Portugal. BMW, Mercedes, Audi, VW — poupe até 8.000€ vs mercado nacional. ISV incluído. Ver disponíveis!',
    keywords: ['carros importados', 'carros importados portugal', 'carros para importar', 'stand carros importados', 'BMW importado', 'Mercedes importado', 'Audi importado'],
    primary: ["carros importados à venda", "usados importados Portugal"],
    supporting: [
      "carros europeus usados",
      "seminovos importados",
      "garantia e histórico",
      "financiamento carros importados",
      "BMW Série 1 usado importado",
      "Audi A3 usado importado",
      "Mercedes Classe A usado importado",
      "Volkswagen Golf usado importado",
      "Peugeot 308 usado importado",
      "Renault Mégane usado importado",
      "Citroën C3 usado importado",
    ],
  },

  blog: {
    title: 'Blog AutoGo.pt — Guias, Reviews e Notícias sobre Importação de Carros',
    description: 'Guias completos, reviews e notícias sobre importação de carros europeus para Portugal. ISV, legalização, os melhores carros para importar em 2026.',
    keywords: ['blog importação carros', 'guia importar carro portugal', 'isv 2026', 'legalizar carro estrangeiro'],
    primary: ["importar carro da Alemanha", "como legalizar carro importado"],
    supporting: [
      "documentos para legalizar carro",
      "certificado de conformidade COC",
      "homologação IMT",
      "inspeção tipo B",
      "atribuição de matrícula",
      "ISV 2026 novidades",
      "custos de transporte e seguro",
      "checklist compra na Alemanha",
    ],
  },

  como_funciona: {
    title: 'Importação de Carros para Portugal: Como Funciona | AutoGo.pt',
    description: 'Saiba como funciona a importação de carros chave-na-mão: escolha, negociação, ISV e legalização em 3–6 semanas. Processo 100% transparente. AutoGo Guimarães.',
    keywords: ['importação de carros', 'importar carro portugal', 'legalizar carro importado', 'processo importação automóvel', 'chave na mão'],
    primary: ["processo de importação de carros", "legalização de viaturas"],
    supporting: [
      "passo a passo importação",
      "documentos IMT",
      "inspeção tipo B",
      "homologação e COC",
      "atribuição de matrícula",
      "prazos e taxas",
    ],
  },

  contacto: {
    title: 'Importação Automóvel Guimarães | AutoGo.pt | +351 935 179 591',
    description: 'AutoGo em Guimarães — especialistas em importação e legalização de carros europeus. Atendimento WhatsApp disponível. Resposta em 24h.',
    keywords: ['importação automóvel guimarães', 'importar carros braga', 'AutoGo guimarães', 'importação carros norte portugal'],
    primary: ["AutoGo", "contacto importação"],
  },

  pedido: {
    title: 'Pedir Importação | Proposta Gratuita em 24h | AutoGo.pt',
    description: 'Peça proposta GRATUITA de importação em 24h. Indicamos o carro ideal, negociamos preço, tratamos legalização. Processo transparente, zero risco.',
    keywords: ['pedir importação carro', 'proposta importação automóvel', 'orçamento importar carro portugal'],
    primary: ["pedir importação", "proposta gratuita"],
  },

  sobre_nos: {
    title: 'Sobre a AutoGo.pt | Especialistas em Importação Automóvel, Guimarães',
    description: 'AutoGo.pt, especialista em importação e legalização de viaturas europeias. Equipa dedicada em Guimarães. Serviço completo, 100% transparente.',
    keywords: ['sobre AutoGo', 'especialistas importação portugal', 'importação automóvel guimarães'],
    primary: ["AutoGo", "sobre a AutoGo"],
    supporting: [
      "serviço de importação de viaturas",
      "equipa AutoGo",
      "porquê importar com a AutoGo",
    ],
  },

  simulador_iuc: {
    title: 'Simulador IUC 2026 GRÁTIS Portugal | Cálculo Instantâneo | AutoGo.pt',
    description: 'Calcule o IUC anual do seu carro em segundos — grátis, sem registo, atualizado para 2026. Categoria A (pós-2007), Categoria B (pré-2007) e elétricos isentos. AutoGo.pt',
    keywords: ['simulador iuc', 'simulador iuc 2026', 'iuc calculadora', 'calcular iuc portugal', 'tabela iuc 2026', 'iuc 2026', 'imposto único de circulação'],
    primary: ['Simulador IUC', 'calcular IUC'],
    supporting: [
      'tabela IUC 2026',
      'IUC categoria A',
      'IUC categoria B',
      'IUC elétricos isenção',
      'coeficiente antiguidade IUC',
      'IUC carros importados',
      'ISV vs IUC diferença',
    ],
    faq: [
      'Qual a diferença entre ISV e IUC?',
      'Como calcular o IUC de um carro importado?',
      'Os carros elétricos pagam IUC?',
      'O que é o coeficiente de antiguidade no IUC?',
      'Quando se paga o IUC em Portugal?',
    ],
  },
};

export const AVOID_AS_PRIMARY = [
  "Audi",
  "BMW",
  "Mercedes",
  "Peugeot",
  "exclusivo",
  "inovador",
];
