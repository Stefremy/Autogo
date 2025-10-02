export function formatPriceDisplay(price: number | null | undefined, priceDisplay?: string | null) {
  // If numeric price available, format as Euro
  if (price !== undefined && price !== null && Number.isFinite(price)) {
    return '€' + Number(price).toLocaleString(undefined, { minimumFractionDigits: 0 });
  }
  // If priceDisplay is provided and looks numeric, format it
  if (typeof priceDisplay === 'string' && priceDisplay.trim().length > 0) {
    const parsed = Number(String(priceDisplay).replace(/[^0-9.-]/g, ''));
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return '€' + parsed.toLocaleString(undefined, { minimumFractionDigits: 0 });
    }
    // non-numeric textual display (e.g. 'sob consulta') — title-case each word
    return priceDisplay
      .split(/\s+/)
      .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(' ');
  }
  return '—';
}
