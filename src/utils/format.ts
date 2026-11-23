/** Format a number with Russian-style spaces as thousands separator */
export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Format a number as rubles: "1 234 567 ₽" */
export function formatRubles(value: number): string {
  return `${formatNumber(value)} ₽`;
}

/** Format percentage: "4%" */
export function formatPercent(value: number): string {
  return `${value}%`;
}

/** Parse a formatted number string back to a number */
export function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/\s/g, '').replace(/[^\d.,\-]/g, '');
  const num = parseFloat(cleaned.replace(',', '.'));
  return isNaN(num) ? 0 : num;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
