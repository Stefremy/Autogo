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
  "iuc",
  "iuc 2026",
  "calcular iuc",
  "tabela iuc 2026",
  "simulador iuc 2026",
  "iuc calculadora",
  // ✅ Intenção comercial — carros importados
  "iuc carros importados",
  "iuc carro importado alemanha",
  "simulador iuc carro importado",
  "iuc importação automóvel",
  // ✅ Trending 2026 — nova regra data única pagamento
  "iuc 2026 quando pagar",
  "iuc 2026 data pagamento",
  "iuc carros elétricos 2026",
  "iuc híbridos 2026",
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
  "simulador isv 2026",
  "isv simulador 2026",
  "calcular isv portugal",
  "tabela isv 2026",
  // ✅ Evergreen — utilizadores que pesquisam anos anteriores (alto volume residual)
  "isv simulador 2021",
  "simulador isv 2021",
  "isv simulador 2022",
  "simulador isv 2022",
  "simulador isv 2023",
  "simulador isv 2024",
  "simulador isv 2025",
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
      "Quanto posso poupar ao importar um carro da Europa?",
      "Qual é o prazo para receber o carro importado?",
      "Os carros elétricos importados pagam ISV?",
      "O que está incluído no serviço chave-na-mão da AutoGo?",
    ],
  },

  simulador_isv: {
    title: 'Simulador ISV 2026 GRÁTIS Portugal | Resultado Instantâneo | AutoGo.pt',
    description: 'Calcule o ISV em segundos — o simulador mais preciso de Portugal. Grátis, sem registo, atualizado 2026. Carros novos, usados e elétricos. AutoGo.pt',
    keywords: ['simulador isv', 'isv simulador', 'simulador isv 2026', 'isv simulador 2026', 'calcular isv portugal', 'tabela isv 2026', 'simulador isv 2026', 'isv', 'isv simulador 2021', 'simulador isv 2021', 'isv simulador 2022', 'simulador isv 2022', 'simulador isv 2023', 'simulador isv 2024', 'simulador isv 2025', 'simulador legalização auto'],
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
      "Como calcular o ISV de um carro importado?",
      "Qual é a diferença entre NEDC e WLTP no cálculo do ISV?",
      "Os carros elétricos pagam ISV em Portugal?",
      "Como funciona a redução do ISV para carros usados?",
      "O simulador de ISV da AutoGo é gratuito?",
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
    faq: [
      "Como funciona o serviço chave-na-mão da AutoGo?",
      "Quanto tempo demora a importar um carro?",
      "O que está incluído no serviço de importação?",
      "Posso pedir um carro específico que não esteja no stock?",
      "Quanto posso poupar ao importar um carro da Europa pela AutoGo?",
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

  legalizar_carro_importado: {
    title: "Como Legalizar Carros Importados em Portugal 2026 | Guia Completo | AutoGo.pt",
    description:
      "Guia completo para legalizar carros importados em Portugal: DAV, ISV, CoC e matrícula PT explicados passo a passo. A AutoGo importa e legaliza por si — sem burocracia.",
    keywords: [
      "legalizar carro importado",
      "legalizar carro estrangeiro portugal",
      "legalização carro importado portugal",
      "legalizar carro importado portugal 2026",
      "importar e legalizar carro portugal",
      "importação e legalização automóvel",
      "dav finanças veículo",
      "declaração aduaneira veículos",
      "coc certificado de conformidade",
      "inspeção modelo 112",
      "homologação imt carro importado",
      "matrícula carro importado portugal",
      "prazo legalizar carro importado",
      "isenção isv mudança residência",
      "legalizar carro alemanha portugal",
      "custos legalização carro importado",
      "quanto tempo legalizar carro importado",
      "documentos legalizar carro importado",
      "legalizar carro",
      "legalizar carros",
      "isv legalização",
    ],
    primary: ["importação e legalização de carros portugal", "legalizar carro importado"],
    supporting: [
      "importar e legalizar carro portugal",
      "serviço chave-na-mão importação legalização",
      "DAV declaração aduaneira veículos",
      "CoC certificado de conformidade incluído",
      "inspeção Modelo 112",
      "ISV cálculo antes de importar",
      "homologação IMT Portugal",
      "matrícula portuguesa carro estrangeiro",
      "isenção ISV mudança de residência",
      "prazo legalização 20 dias úteis",
    ],
    faq: [
      "Qual o prazo para legalizar um carro importado em Portugal?",
      "O que acontece se não legalizar o carro importado a tempo?",
      "Posso conduzir o carro antes de ter matrícula portuguesa?",
      "O que é a DAV e onde se faz?",
      "Preciso do CoC para legalizar? Está incluído?",
      "Posso ter isenção de ISV por mudança de residência?",
      "Quanto tempo demora a importação e legalização de um carro?",
    ],
  },

  isv_portugal: {
    title: 'ISV em Portugal 2026 | O que é, Como Calcular e Tabelas | AutoGo.pt',
    description:
      'Tudo sobre o ISV em Portugal 2026 — tabelas oficiais, cálculo, isenções, elétricos e híbridos. Simule o ISV do seu carro grátis em segundos. AutoGo.pt',
    keywords: [
      'isv portugal',
      'isv 2026',
      'o que é o isv',
      'imposto sobre veículos portugal',
      'isv cálculo 2026',
      'como calcular isv',
      'tabela isv 2026',
      'isv carros usados',
      'desconto isv carro usado',
      'isenção isv portugal',
      'isv elétricos',
      'isv híbridos plug-in',
      'isv phev 2026',
      'euro 6e-bis isv',
      'isv mudança residência',
      'isv família numerosa',
      'isv vs iuc',
      'componente cilindrada isv',
      'componente ambiental isv',
      'isv carro importado',
      'isv importação automóvel portugal',
      'quanto é o isv portugal',
      'isv carro alemanha',
    ],
    primary: ['ISV Portugal 2026', 'imposto sobre veículos portugal', 'como calcular ISV'],
    supporting: [
      'tabela ISV 2026',
      'desconto ISV carros usados',
      'isenção ISV elétricos',
      'ISV PHEV Euro 6e-bis',
      'componente cilindrada ISV',
      'componente ambiental CO₂ ISV',
      'ISV vs IUC diferença',
      'ISV carro importado',
    ],
    faq: [
      'O que é o ISV em Portugal?',
      'Quanto é o ISV em Portugal em 2026?',
      'Os carros elétricos pagam ISV?',
      'Qual a diferença entre ISV e IUC?',
      'Os híbridos plug-in têm desconto no ISV em 2026?',
      'Posso ter isenção de ISV ao importar um carro?',
    ],
  },

  simulador_iuc: {
    title: 'Simulador IUC 2026 GRÁTIS | Calcular IUC Portugal | AutoGo.pt',
    description: 'Calcule o IUC 2026 grátis em segundos — tabelas oficiais, carros importados, elétricos e híbridos. Nova data de pagamento IUC 2026 explicada. AutoGo.pt',
    keywords: [
      'simulador iuc', 'iuc', 'iuc 2026', 'calcular iuc', 'tabela iuc 2026',
      'simulador iuc 2026', 'iuc calculadora', 'calcular iuc portugal',
      'iuc categoria a', 'iuc categoria b', 'iuc gasolina 2026', 'iuc gasóleo 2026',
      'iuc elétrico isento', 'iuc nedc wltp', 'iuc coeficiente ano',
      'taxa adicional gasóleo iuc', 'iuc carros importados', 'isv vs iuc',
      // ✅ Intenção comercial
      'iuc carro importado alemanha', 'simulador iuc carro importado', 'iuc importação automóvel',
      // ✅ Trending 2026 — data única pagamento
      'iuc 2026 quando pagar', 'iuc 2026 data pagamento', 'iuc carros elétricos 2026', 'iuc híbridos 2026',
    ],
    primary: ['Simulador IUC 2026', 'calcular IUC', 'IUC 2026 Portugal'],
    supporting: [
      'tabela IUC 2026',
      'IUC categoria A até 2007',
      'IUC categoria B pós 2007',
      'IUC elétricos isenção',
      'taxa adicional gasóleo IUC',
      'IUC NEDC vs WLTP',
      'IUC carros importados',
      'ISV vs IUC diferença',
      'coeficiente ano matrícula IUC',
    ],
    faq: [
      'O que é o IUC em Portugal?',
      'Como é calculado o IUC em 2026?',
      'Quando se paga o IUC em 2026? — Nova data única',
      'Os carros elétricos pagam IUC em 2026?',
      'IUC híbridos 2026 — qual o valor?',
      'Qual a diferença entre ISV e IUC?',
      'Como calcular o IUC de um carro importado da Alemanha?',
      'O simulador IUC da AutoGo é gratuito?',
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
