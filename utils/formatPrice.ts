export function formatPriceDisplay(price: number | null | undefined, priceDisplay?: string | null) {
  // If numeric price available, format as Euro
  if (price !== undefined && price !== null && Number.isFinite(price) && price > 0) {
    return '€' + Number(price).toLocaleString(undefined, { minimumFractionDigits: 0 });
  }
  // If priceDisplay is provided and looks numeric, format it
  if (typeof priceDisplay === 'string' && priceDisplay.trim().length > 0) {
    const s = priceDisplay.trim();
    // Treat common placeholder tokens as missing
    if (/^(null|undefined|n\/a|na|-|—)$/i.test(s)) return 'Sob Consulta';
    const digitsOnly = String(s).replace(/[^0-9.-]/g, '');
    if (digitsOnly.length > 0) {
      const parsed = Number(digitsOnly);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed) && parsed > 0) {
        return '€' + parsed.toLocaleString(undefined, { minimumFractionDigits: 0 });
      }
      // If parsed is 0 or invalid, treat as missing
      return 'Sob Consulta';
    }
    // non-numeric textual display (e.g. 'sob consulta') — title-case each word
    return s
      .split(/\s+/)
      .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(' ');
  }
  return 'Sob Consulta';
}
