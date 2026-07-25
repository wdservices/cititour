/**
 * Format a price value (number or string) into "₦550,000" with commas.
 * Handles strings like "550000", "₦550000", "550,000", or raw numbers.
 */
export function formatPrice(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';

  let num: number;
  if (typeof value === 'number') {
    num = value;
  } else {
    // Strip everything except digits and decimal point
    const cleaned = String(value).replace(/[^0-9.]/g, '');
    num = parseFloat(cleaned);
  }

  if (isNaN(num)) return String(value);

  return '₦' + num.toLocaleString('en-NG');
}

/**
 * Get the raw numeric value from a price (number or string).
 */
export function parsePrice(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

/**
 * Format a discount percentage from original and promo prices.
 */
export function discountPercent(original: unknown, promo: unknown): number {
  const orig = parsePrice(original);
  const prom = parsePrice(promo);
  if (orig <= 0 || prom <= 0 || prom >= orig) return 0;
  return Math.round(((orig - prom) / orig) * 100);
}

/**
 * Check if a listing was created within the last 24 hours.
 */
export function isRecentlyListed(createdAt?: string): boolean {
  if (!createdAt) return false;
  try {
    const created = new Date(createdAt).getTime();
    if (isNaN(created)) return false;
    return Date.now() - created < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
