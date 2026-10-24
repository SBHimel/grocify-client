/**
 * Shared Bangladeshi Taka (BDT) currency formatting utility for Grocify.
 * Standardizes price displays across storefront and dashboards to ৳ (e.g. ৳4.99).
 */

export const BDT_SYMBOL = "৳";
export const CURRENCY_CODE = "BDT";

/**
 * Format a numeric amount into BDT currency string with '৳' symbol.
 * Example: 4.99 -> "৳4.99", 1250 -> "৳1,250.00"
 */
export function formatBDT(amount: number | string | null | undefined): string {
  if (amount === undefined || amount === null || amount === "") {
    return `${BDT_SYMBOL}0.00`;
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(numeric)) {
    return `${BDT_SYMBOL}0.00`;
  }

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    // Fallback if environment lacks narrowSymbol support
    return `${BDT_SYMBOL}${numeric.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

/**
 * Alias for formatBDT to support semantic price formatting.
 */
export const formatPrice = formatBDT;
