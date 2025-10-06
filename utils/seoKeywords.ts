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
  "Simulador ISV",
  "simulador de carros",
  "simulador impostos carros",
  "carros em segunda mão",
  "carros importados",
  "carros usados",
  "carros BMW",
  "Audi",
  "Mercedes",
  "Peugeot",
  "carros europeus",
  "AutoGo.pt",
  "exclusivo",
  "inovador",
];

export const VIATURAS_KEYWORDS = [
  "carros importados",
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
