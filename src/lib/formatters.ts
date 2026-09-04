/**
 * Formatting utilities for Indian Rupee currency, tenures, and percentages
 */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTenure(months: number): string {
  if (months < 12) {
    return `${months} months`;
  }
  const years = months / 12;
  if (Number.isInteger(years)) {
    return `${months} months (${years} ${years === 1 ? "year" : "years"})`;
  }
  return `${months} months`;
}

export function formatInterest(rate: number): string {
  if (rate === 0) return "0% interest";
  return `${rate}% interest`;
}
