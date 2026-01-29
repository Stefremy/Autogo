/**
 * Utility functions for processing car data, parsing numbers, and normalizing strings.
 * Centralizing this logic avoids duplication across pages.
 */

/**
 * Safely parses a value into a number (integer or float).
 * Handles strings with commas/dots, removes non-numeric characters.
 */
export function parseNumber(v: any): number | null {
    if (v == null) return null;
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;

    // Remove all non-digit characters except dot, comma, and minus
    const cleaned = String(v).replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
}

/**
 * Specifically for mileage: usually integers, often with 'km' suffix.
 */
export function parseMileage(v: any): number | null {
    if (v == null) return null;
    if (typeof v === 'number') return v;

    // Strict integer parsing for mileage
    const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) ? n : null;
}

/**
 * Specifically for price: handles formatting nuances.
 */
export function parsePrice(v: any): number | null {
    return parseNumber(v);
}

/**
 * Normalizes make strings for filtering (map common variants to canonical keys).
 * Example: "Mercedes", "Mercedes-Benz", "mercedesbenz" -> "mercedes-benz"
 */
export function normalizeMake(m?: string): string {
    if (!m) return "";
    const s = String(m).toLowerCase().trim();
    // create a compact key (remove non-alphanum) to match variants
    const key = s.replace(/[^a-z0-9]/g, "");

    const ALIASES: Record<string, string> = {
        mercedes: "mercedes-benz",
        mercedesbenz: "mercedes-benz",
        vw: "volkswagen",
        bmw: "bmw",
        audi: "audi",
        // add more aliases here when needed
    };

    return ALIASES[key] || s;
}
