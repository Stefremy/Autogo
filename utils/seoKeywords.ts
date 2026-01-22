// Centralized SEO keyword lists for consistent meta keywords across pages.
export const SITE_WIDE_KEYWORDS = [
  "carros importados",
  "carros europeus",
  "carros usados",
  "carros seminovos europeus",
  "carros em segunda mão",
  "AutoGo.pt",
];

export const HOME_KEYWORDS = [
  "carros importados",
  "carros usados",
  "carros importados Portugal",
  "carros usados Portugal",
  "Simulador ISV",  
  "carros em segunda mão",
  "simulador de carros",
  "simulador impostos carros",
  "carros importados baratos",
  "carros usados importados",
  "carros BMW",
  "carros BMW importados",
  "Audi",
  "Mercedes",
  "Peugeot",
  "carros europeus",
  "viaturas importadas",
  "AutoGo.pt",
  "importação automóvel",
  "legalização carros",
];

export const VIATURAS_KEYWORDS = [
  "carros importados",
  "carros usados",
  "carros importados Portugal",
  "carros usados Portugal",
  "carros importados baratos",
  "carros usados importados",
  "carros europeus",
  "carros BMW usados",
  "carros BMW importados",
  "Audi usados",
  "Audi importados",
  "Mercedes usados",
  "Mercedes importados",
  "Peugeot usados",
  "Volkswagen usados",
  "Renault usados",
  "Citroën usados",
  "carros importados à venda",
  "carros usados à venda",
  "viaturas importadas",
  "viaturas usadas",
  "carros seminovos europeus",
  "carros segunda mão importados",
  "stand carros importados",
];

export const BLOG_KEYWORDS = [
  "blog carros importados",
  "carros europeus",
  "carros BMW usados",
  "Audi usados",
  "Mercedes usados",
  "Peugeot usados",
  "Volkswagen usados",
  "Renault usados",
  "Citroën usados",
  "carros importados à venda",
  "carros importados Portugal",
  "carros usados europeus",
  "carros seminovos europeus",
  "Noticias automóveis",
  "Noticias carros",
  "Noticias importação carros",
  "Noticias importação viaturas",
  "Noticias AutoGo",
  "Noticias AutoGo.pt",
  "Noticias carros importados",
  "Noticias carros europeus",
  "Noticias carros usados",
  "Noticias carros seminovos europeus",
  "Noticias carros em segunda mão",
  "Noticias AutoGo.pt",
  "Noticias AutoGo",
  "Noticias importação viaturas",
    "Noticias importação carros",
    "reviews de carros"
];

export const SIMULADOR_KEYWORDS = [
  "Simulador ISV",
  "simulador ISV Portugal",
  "calcular ISV",
  "ISV Portugal",
  "simulador impostos carros",
  "simulador de carros",
  "AutoGo.pt",
  "cálculo ISV",
  "importação de viaturas",
  "importar carro Portugal",
   "legalização viaturas",
"transporte e legalização Portugal",    
];

export const ABOUT_KEYWORDS = [
  "AutoGo.pt",
  "importação de carros",
  "sobre AutoGo",
  "equipa AutoGo",
  "importar carro Portugal",
  "importação de viaturas",
  "Quem somos",
];

export const COMO_FUNCIONA_KEYWORDS = [
  "importação de viaturas",
  "processo importação carros",
  "como funciona AutoGo",
  "legalização viaturas",
  "transporte e legalização Portugal",
];

export function joinKeywords(...lists: string[][]) {
  const merged: string[] = [];
  for (const l of lists) {
    for (const k of l) if (k && !merged.includes(k)) merged.push(k);
  }
  return merged.join(", ");
}

export type SEOSet = {
  primary: string[];
  supporting?: string[];
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
    primary: ["Simulador ISV", "calcular ISV"],
    supporting: [
      "tabela ISV 2025",
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
    primary: ["importar carro da Alemanha", "como legalizar carro importado"],
    supporting: [
      "documentos para legalizar carro",
      "certificado de conformidade COC",
      "homologação IMT",
      "inspeção tipo B",
      "atribuição de matrícula",
      "ISV 2025 novidades",
      "custos de transporte e seguro",
      "checklist compra na Alemanha",
    ],
  },

  como_funciona: {
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

  about: {
    primary: ["AutoGo", "sobre a AutoGo"],
    supporting: [
      "serviço de importação de viaturas",
      "equipa AutoGo",
      "porquê importar com a AutoGo",
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
