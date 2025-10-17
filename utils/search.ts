// Utility helpers for client-side search and query matching
// Keeps normalization logic centralized so viaturas and other pages can share behaviour.
export function normalizeText(s?: any): string {
  if (s == null) return "";
  try {
    const str = String(s).toLowerCase().trim();
    // Normalize diacritics, replace punctuation with spaces and collapse multiple spaces
    const noDiacritics = str.normalize ? str.normalize("NFD").replace(/\p{Diacritic}/gu, "") : str;
    return noDiacritics.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return String(s).toLowerCase();
  }
}

export function tokenize(s: string): string[] {
  if (!s) return [];
  return normalizeText(s).split(/\s+/).filter(Boolean);
}

// Apply a few common alias normalizations to the query tokens so users can
// type variations like "segunda mão", "segunda mao" or "usado".
function normalizeTokenAliases(tok: string): string {
  if (!tok) return tok;
  if (tok === 'segunda' || tok === 'mao' || tok === 'mao' || tok === 'segundamao') return 'segunda_mao';
  if (tok === 'usado' || tok === 'usados' || tok === 'usada' || tok === 'usadas') return 'usados';
  return tok;
}

export function normalizeQuery(q?: string): string[] {
  const toks = tokenize(q || '');
  return toks.map(normalizeTokenAliases).filter(Boolean);
}

// Build a single searchable string from a car record
export function buildSearchText(car: any): string {
  if (!car) return '';
  const parts: string[] = [];
  // Common fields to search
  ['make','model','fullModel','slug','description','category','origin','country','vin'].forEach((k) => {
    if (car[k]) parts.push(String(car[k]));
  });
  // Add year, mileage, price and tags if present
  if (car.year) parts.push(String(car.year));
  if (car.mileage) parts.push(String(car.mileage));
  if (car.price) parts.push(String(car.price));
  if (Array.isArray(car.tags)) parts.push(...car.tags.map(String));
  // include images/ids where helpful
  if (car.id) parts.push(String(car.id));
  return normalizeText(parts.join(' '));
}

// matchesQuery: returns true if all query tokens appear in the searchable car text.
// Uses substring matching so partial tokens like "c300" can match "amg c300".
export function matchesQuery(car: any, query?: string): boolean {
  if (!query || !String(query).trim()) return true;
  const qTokens = normalizeQuery(query);
  if (qTokens.length === 0) return true;
  const hay = buildSearchText(car);
  for (const t of qTokens) {
    if (!t) continue;
    if (hay.indexOf(t) === -1) return false;
  }
  return true;
}
